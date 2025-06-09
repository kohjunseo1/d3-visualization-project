(() => { 
    document.addEventListener('DOMContentLoaded', () => {
    const paperData =[{"Year":1907,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1915,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":2,"United States":0,"Unknown":0},{"Year":1917,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":0,"Unknown":0},{"Year":1921,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1923,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1927,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":2,"Unknown":0},{"Year":1929,"Australia":0,"Canada":0,"Denmark":0,"France":1,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1930,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":1,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1933,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":4,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1936,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1937,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1939,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1943,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":2,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1944,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1947,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":0,"Unknown":0},{"Year":1948,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":0,"Unknown":0},{"Year":1949,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":2,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1951,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":0,"Unknown":0},{"Year":1952,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1954,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":2,"United States":0,"Unknown":0},{"Year":1955,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1956,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1957,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1959,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1960,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1961,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":1,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1963,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1964,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1965,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":7,"Unknown":0},{"Year":1967,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1968,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1971,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":2},{"Year":1972,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1973,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":4,"Unknown":0},{"Year":1975,"Australia":0,"Canada":0,"Denmark":2,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1976,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1977,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":1,"Unknown":0},{"Year":1978,"Australia":0,"Canada":0,"Denmark":0,"France":1,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1979,"Australia":0,"Canada":0,"Denmark":1,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1980,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1981,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1982,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1983,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1984,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":2,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1986,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1987,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1988,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1989,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1990,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":12,"Unknown":0},{"Year":1992,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":1,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":1994,"Australia":0,"Canada":2,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":1995,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":2,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1996,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":4,"Unknown":0},{"Year":1997,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":1998,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":1999,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":1,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":2000,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":2,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":2002,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":2,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":2003,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":6,"Unknown":0},{"Year":2004,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":2005,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":3,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":4,"Unknown":0},{"Year":2006,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":2007,"Australia":0,"Canada":0,"Denmark":0,"France":1,"Germany":1,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":0,"Unknown":0},{"Year":2008,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":2,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":2010,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":2,"United States":0,"Unknown":0},{"Year":2011,"Australia":1,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":2,"Unknown":0},{"Year":2012,"Australia":0,"Canada":0,"Denmark":0,"France":2,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0},{"Year":2013,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":2,"United States":0,"Unknown":0},{"Year":2014,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":2,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":1,"Unknown":0},{"Year":2015,"Australia":0,"Canada":1,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":1,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":1,"United States":0,"Unknown":0},{"Year":2016,"Australia":0,"Canada":0,"Denmark":0,"France":0,"Germany":0,"India":0,"Ireland":0,"Israel":0,"Japan":0,"Netherlands":0,"Russia":0,"Switzerland":0,"United Kingdom":0,"United States":3,"Unknown":0}];

    const margin = {top: 50, right: 150, bottom: 50, left: 70},
            width = 1200 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#award-trend-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const allCountries = Object.keys(paperData[0]).filter(k => k !== "Year");
    const tooltip = d3.select("#tooltip");

    function createCheckboxes() {
        const container = d3.select("#countryFilterBox");
        container.html("");
        allCountries.forEach(country => {
        const id = `chk_${country.replace(/\s+/g, '')}`;
        const label = container.append("label");
        label.append("input")
            .attr("type", "checkbox")
            .attr("id", id)
            .attr("value", country)
            .property("checked", true);
        label.append("span").text(country);
        });
    }

    const color = d3.scaleOrdinal()
        .domain(allCountries)
        .range(d3.schemeCategory10.concat(d3.schemePaired).slice(0, allCountries.length));

    const maxYear = d3.max(paperData, d => d.Year);
    const yearRange = document.getElementById("yearRange");
    const yearValue = document.getElementById("yearValue");
    yearRange.max = maxYear;
    yearRange.value = maxYear;
    yearValue.textContent = maxYear;

    // 模式转换
    let currentMode = "cumulative";

    function getSelectedCountries() {
        const checkedBoxes = document.querySelectorAll('#countryFilterBox input[type="checkbox"]:checked');
        return Array.from(checkedBoxes).map(cb => cb.value);
    }

    // 年度模式的 (yearly mode) 可视化变化
    function getYearlyData(filteredData, selectedCountries) {
        return filteredData.map(d => {
        const entry = { Year: d.Year };
        selectedCountries.forEach(c => {
            entry[c] = d[c] || 0;
        });
        return entry;
        });
    }

    // 累计模式 (cumulative mode)
    function getCumulativeData(filteredData, selectedCountries) {
        let cumData = [];
        let cumSum = {};
        selectedCountries.forEach(c => cumSum[c] = 0);

        filteredData.forEach(d => {
        const entry = { Year: d.Year };
        selectedCountries.forEach(c => {
            cumSum[c] += d[c] || 0;
            entry[c] = cumSum[c];
        });
        cumData.push(entry);
        });

        return cumData;
    }

    function updateChart(selectedYear) {
        let selectedCountries = getSelectedCountries();
        if (selectedCountries.length === 0) {
        selectedCountries = allCountries;
        }

        const filteredData = paperData.filter(d => d.Year <= selectedYear);

        let dataToUse;
        if (currentMode === "cumulative") {
        dataToUse = getCumulativeData(filteredData, selectedCountries);
        } else { // yearly mode
        dataToUse = getYearlyData(filteredData, selectedCountries);
        }

        const xScale = d3.scaleLinear()
        .domain(d3.extent(dataToUse, d => d.Year))
        .range([0, width]);

        const yMax = d3.max(dataToUse, d =>
        selectedCountries.reduce((sum, c) => sum + (d[c] || 0), 0)
        ) || 0;

        const yScale = d3.scaleLinear()
        .domain([0, yMax * 1.1])
        .range([height, 0]);

        svg.selectAll("*").remove();

        svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
        .call(d3.axisLeft(yScale));

        const stack = d3.stack().keys(selectedCountries);
        const stackedData = stack(dataToUse);

        const area = d3.area()
        .x(d => xScale(d.data.Year))
        .y0(d => yScale(d[0]))
        .y1(d => yScale(d[1]));

        svg.selectAll(".area")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", d => color(d.key))
        .attr("stroke", "grey")
        .attr("stroke-width", 0.5)
        .attr("fill-opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill-opacity", 1);
            tooltip.style("display", "block");
        })
        .on("mousemove", function(event, d) {
            const [mx, my] = d3.pointer(event);
            // 대략 해당 x 위치의 Year 값 계산
            const yearInv = Math.round(xScale.invert(mx));
            const found = d.find(v => v.data.Year === yearInv);
            let val = found ? (found[1] - found[0]) : 0;

            tooltip.html(`
            <strong>国家/机构:</strong> ${d.key}<br/>
            <strong>年份:</strong> ${yearInv}<br/>
            <strong>获奖数:</strong> ${val}
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill-opacity", 0.7);
            tooltip.style("display", "none");
        });

        // 范例
        const legend = svg.selectAll(".legend")
        .data(selectedCountries)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d,i) => `translate(${width + 20}, ${i*25})`);

        legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d));

        legend.append("text")
        .attr("x", 22)
        .attr("y", 14)
        .text(d => d);

    }

    // 最初checkbox
    createCheckboxes();

    updateChart(maxYear);

    // 滑动功能
    yearRange.addEventListener("input", () => {
        const val = +yearRange.value;
        yearValue.textContent = val;
        updateChart(val);
    });

    // checkbox功能
    d3.selectAll("#countryFilterBox input[type=checkbox]").on("change", () => {
        updateChart(+yearRange.value);
    });

    // 模式变化
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
        currentMode = document.querySelector('input[name="mode"]:checked').value;
        updateChart(+yearRange.value);
        });
    });
    });
})();