(() => {
    const width = 600, height = 600;

    const treemapDiv = d3.select("#treemap");
    const sunburstDiv = d3.select("#sunburst");

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("opacity", 0);

    let globalData = null;

    const yearSelect = d3.select("#year-select");
    const categorySelect = d3.select("#category-select"); 

    const categoryToFile = {
    "Physics": "visualization_project/data/Ph_subfield1.csv",
    "Chemistry": "visualization_project/data/Ch_subfield1.csv",
    "Medicine": "visualization_project/data/Me_subfield1.csv"
    };


    const brownColors = ["#A0522D", "#D2691E", "#CD853F", "#F4A460", "#DEB887"];

    
    const sunburstColorGroups = [
    ["#6CA0DC", "#1E90FF", "#00BFFF", "#87CEEB", "#4682B4"],
    ["#7B68EE", "#836FFF", "#8A2BE2", "#9370DB", "#BA55D3"],
    ["#3CB371", "#2E8B57", "#66CDAA", "#20B2AA", "#008080"],
    ["#FF8C00", "#FFA500", "#FF7F50", "#FF6347", "#FF4500"],
    ["#FF69B4", "#FF1493", "#DB7093", "#C71585", "#D87093"]
    ];

    let sunburstSubfieldColorAssign = new Map();

    function loadDataAndInit(category) {
    const dataFile = categoryToFile[category];
    if (!dataFile) {
        alert("잘못된 카테고리입니다.");
        return;
    }

    d3.csv(dataFile).then(data => {
        data.forEach(d => {
        d["Prize year"] = +d["Prize year"];
        d.journal_lower = d.journal_lower ? d.journal_lower.toLowerCase() : "";
        d.Subfield = d.Subfield ? d.Subfield.trim() : "";
        });

        globalData = data;

        
        const years = Array.from(new Set(data.map(d => d["Prize year"]))).sort((a, b) => a - b);

        yearSelect.selectAll("option").remove();

        yearSelect.selectAll("option")
        .data(years)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        const initYear = years[years.length - 1];
        yearSelect.property("value", initYear);

        updateVisualizations(initYear);
    });
    }

    function updateVisualizations(year) {
    if (!globalData) return;

    
    const filteredClean = globalData
        .filter(d => d["Prize year"] === year)
        .filter(d => d.journal_lower && d.journal_lower !== "unknown")
        .filter(d => d.Subfield && d.Subfield !== "");

    
    const nestedTreemap = d3.rollup(
        filteredClean,
        v => v.length,
        d => d.Subfield,
        d => d.journal_lower
    );

    const treemapRoot = {
        name: "root",
        children: Array.from(nestedTreemap, ([subfield, journalMap]) => ({
        name: subfield,
        children: Array.from(journalMap, ([journal, count]) => ({
            name: journal,
            value: count
        }))
        }))
    };

    drawTreemap(treemapRoot);

    const subfieldCounts = Array.from(
        d3.rollup(filteredClean, v => v.length, d => d.Subfield),
        ([subfield, count]) => ({ subfield, count })
    )
        .filter(d => d.subfield)
        .sort((a, b) => d3.descending(a.count, b.count))
        .slice(0, 5);

    const topSubfields = subfieldCounts.map(d => d.subfield);

    sunburstSubfieldColorAssign = new Map();
    topSubfields.forEach((sf, i) => {
        sunburstSubfieldColorAssign.set(sf, sunburstColorGroups[i % sunburstColorGroups.length]);
    });

    const filteredTop = filteredClean.filter(d => topSubfields.includes(d.Subfield));

    const nestedSunburst = d3.rollup(
        filteredTop,
        v => v.length,
        d => d.Subfield,
        d => d.journal_lower
    );

    const sunburstRoot = {
        name: "root",
        children: Array.from(nestedSunburst, ([subfield, journalMap]) => ({
        name: subfield,
        children: Array.from(journalMap, ([journal, count]) => ({
            name: journal,
            value: count
        }))
        }))
    };

    drawSunburst(sunburstRoot);

    updateLegend(subfieldCounts, nestedSunburst);
    }

    function updateLegend(subfieldCounts, nestedSunburst) {
    const legendDiv = d3.select("#legend3");
    legendDiv.selectAll("*").remove();

    subfieldCounts.forEach((sf, i) => {
        const subfieldName = sf.subfield;
        const journals = Array.from(nestedSunburst.get(subfieldName) || [])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

        const sfDiv = legendDiv.append("div")
        .attr("class", "legend3-subfield");

        sfDiv.append("div")
        .attr("class", "title")
        .text(`${i + 1}. ${subfieldName}`);

        const journalList = sfDiv.append("ul")
        .attr("class", "legend3-journals");

        journals.forEach(([journal, count]) => {
        journalList.append("li")
            .text(`${journal}: ${count}`);
        });
    });
    }

    function drawTreemap(data) {
    treemapDiv.select("svg").remove();

    const collapsed = {
        name: "root",
        children: data.children.map(subfield => ({
        name: subfield.name,
        value: d3.sum(subfield.children, d => d.value)
        }))
    };

    const svg = treemapDiv.append("svg")
        .attr("width", width)
        .attr("height", height);

    const root = d3.hierarchy(collapsed)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(2)(root);

    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", (d, i) => brownColors[i % brownColors.length])
        .attr("stroke", "#fff")
        .on("mouseover", function (event, d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(`<strong>Journal:</strong> ${d.data.name}<br><strong>Count:</strong> ${d.value}`);
        })
        .on("mousemove", function (event) {
        tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
        tooltip.transition().duration(100).style("opacity", 0);
        });

    nodes.append("text")
        .attr("x", 4)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("fill", "white")
        .text(d => `${d.data.name} (${d.value})`)
        .style("font-size", function(d) {
            const width = d.x1 - d.x0;
            if (width < 30) {
                return "8px";
            } else if (width < 60) {
                return "10px";
            } else {
                return "16px"; 
            }
        });
}

    function drawSunburst(data) {
    sunburstDiv.select("svg").remove();

    const radius = Math.min(width, height) / 2;

    const svg = sunburstDiv.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "12px sans-serif")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const partition = d3.partition()
        .size([2 * Math.PI, radius]);

    partition(root);

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

    svg.selectAll("path")
        .data(root.descendants().filter(d => d.depth))
        .join("path")
        .attr("display", d => d.depth ? null : "none")
        .attr("d", arc)
        .attr("fill", d => {
        const subfieldNode = d.ancestors().find(a => a.depth === 1);
        if (!subfieldNode) return "#ccc";

        const colors = sunburstSubfieldColorAssign.get(subfieldNode.data.name) || sunburstColorGroups[0];
        if (!d.parent) return colors[0];
        const idx = d.parent.children.indexOf(d);
        return colors[idx % colors.length];
        })
        .attr("stroke", "#fff")
        .on("mouseover", function (event, d) {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(`<strong>${d.data.name}</strong><br>Count: ${d.value}`);
        })
        .on("mousemove", function (event) {
        tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
        tooltip.transition().duration(100).style("opacity", 0);
        });
    }

    function setup() {
    const categories = Object.keys(categoryToFile);
    categorySelect.selectAll("option")
        .data(categories)
        .join("option")
        .attr("value", d => d)
        .text(d => d);


    const initCategory = categories[0];
    categorySelect.property("value", initCategory);
    loadDataAndInit(initCategory);


    categorySelect.on("change", function () {
        loadDataAndInit(this.value);
    });

    yearSelect.on("change", function () {
        updateVisualizations(+this.value);
    });
    }

    setup();
})();
