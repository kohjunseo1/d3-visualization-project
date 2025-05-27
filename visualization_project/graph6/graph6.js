(() => { 
    const width = 960, height = 600;
    const svg = d3.select("#choropleth-map")
    .attr("width", width)
    .attr("height", height);

    const tooltip = d3.select("#tooltip6");

    const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // 0인 국가용 색상
    const zeroColor = "#eee";  // 0인 국가용 색상

    const colorDomain = [1, 5, 10, 20, 50, 100];
    // d3.schemeSet2는 7개인데, 0용 색상 때문에 6개만 슬라이스
    const colorRange = d3.schemeSet2.slice(0, 6);

    const colorScale = d3.scaleThreshold()
    .domain(colorDomain)
    .range(colorRange);


    // CSV 국가명 → GeoJSON 국가명 매핑 (필요시 추가)
    const countryNameMap = {
    "USA": "United States of America",
    "UK": "United Kingdom",
    "Germany": "Germany",
    "France": "France",
    "Japan": "Japan",
    "China": "China",
    "Canada": "Canada",
    "Sweden": "Sweden",
    "Switzerland": "Switzerland",
    "Netherlands": "Netherlands",
    "Italy": "Italy",
    "Austria": "Austria",
    "Russia": "Russia",
    "Tunisia":"Tunisia",
    "Australia":"Australia",
    "Belgium":"Belgium",
    "Israel":"Israel",
    "Pakistan":"Pakistan",
    "Denmark":"Denmark",
    "Ukraine":"Ukraine",
    "Ireland":"Ireland",
    "India":"India",
    "Norway":"Norway",
    "Czech Republic":"Czech Republic",
    "Finland":"Finland",
    "Malaysia":"Malaysia",
    "Hungary":"Hungary",
    "South Africa":"South Africa",
    "Portugal":"Portugal",
    "Other": null
    };

    Promise.all([
    d3.csv("visualization_project/data/nobel_awards.csv"),
    d3.json("visualization_project/data/world_countries.json")
    ]).then(([awardData, world]) => {

    const countryCounts = {};

    awardData.forEach(d => {
        let c = d['Guessed Country']?.trim();
        if (!c || c === "Other") return;

        const mappedName = countryNameMap[c] || c;

        if (mappedName) {
        countryCounts[mappedName] = (countryCounts[mappedName] || 0) + 1;
        }
    });

    // GeoJSON 각 국가에 수상 횟수 연결
    world.features.forEach(f => {
        const geoName = f.properties.name;
        f.properties.awards = countryCounts[geoName] || 0;
    });

    // 줌/팬 설정용 그룹
    const g = svg.append("g");

    // 지도 그리기
    const countries = g.selectAll("path")
        .data(world.features)
        .join("path")
        .attr("d", path)
        .attr("fill", d => {
        // 0이면 연한 회색
        if (d.properties.awards === 0) return zeroColor;
        return colorScale(d.properties.awards);
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => {
        tooltip
            .classed("hidden", false)
            .html(`<strong>${d.properties.name}</strong><br/>Awards: ${d.properties.awards}`);

        moveTooltip(event);
        })
        .on("mousemove", event => moveTooltip(event))
        .on("mouseout", () => {
        tooltip.classed("hidden", true);
        });

    // 줌 함수 정의
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", event => {
        g.attr("transform", event.transform);
        });

    svg.call(zoom);

    // 툴팁 위치 조정 함수 (화면 밖 안 나가도록)
    function moveTooltip(event) {
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        let x = event.pageX + 15;
        let y = event.pageY - 30;

        // 우측 화면 밖 체크
        if (x + tooltipWidth > window.innerWidth) {
        x = event.pageX - tooltipWidth - 15;
        }
        // 상단 화면 밖 체크
        if (y < 0) {
        y = event.pageY + 15;
        }

        tooltip.style("left", x + "px")
            .style("top", y + "px");
    }

    createLegend();

    createHeatmap(awardData);

    }).catch(console.error);


    // 범례 생성 함수 (0 포함, 색상+라벨 개수 맞춤)
    function createLegend() {
    const legend = d3.select("#legend6");
    legend.html("");

    const colors = [zeroColor, ...colorRange];  // 총 7개 색상
    const labels = ["0", "1-4", "5-9", "10-19", "20-49", "50-99", "100+"];  // 7개 라벨

    const legendItems = legend.selectAll(".legend6-item")
        .data(colors)
        .join("div")
        .attr("class", "legend6-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin", "4px");

    legendItems.html("")
        .append("div")
        .attr("class", "legend6-color")
        .style("width", "20px")
        .style("height", "20px")
        .style("margin-right", "8px")
        .style("background-color", d => d)
        .style("border", d => d === zeroColor ? "1px solid #ccc" : "none");

    legendItems.append("div")
        .text((d, i) => labels[i]);
    }



    // 히트맵 함수는 기존과 동일
    function createHeatmap(awardData) {
    const instCounts = {};
    awardData.forEach(d => {
        const inst = d['Affiliation']?.toLowerCase().trim();
        if (inst) {
        instCounts[inst] = (instCounts[inst] || 0) + 1;
        }
    });

    const sortedData = Object.entries(instCounts)
        .filter(([name, count]) => name && count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    const container = d3.select("#heatmap").html("");
    const table = container.append("table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    thead.append("tr")
        .selectAll("th")
        .data(["Institution", "Number of Awards"])
        .join("th")
        .text(d => d);

    const counts = sortedData.map(d => d[1]);
    const quantile = d3.scaleQuantile().domain(counts).range([1, 2, 3, 4, 5]);

    const rows = tbody.selectAll("tr")
        .data(sortedData)
        .join("tr");

    rows.selectAll("td")
        .data(d => [d[0], d[1]])
        .join("td")
        .attr("class", (d, i) => i === 1 ? "heat heat-" + quantile(d) : null)
        .text(d => d);
    }
})();