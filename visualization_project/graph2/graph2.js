(() => {
  const margin = { top: 50, right: 40, bottom: 60, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip2 = d3.select("body")
    .append("div")
    .attr("class", "tooltip2");

  let allData = [];

  const colorScale = d3.scaleOrdinal()
    .domain(["Physics", "Chemistry", "Medicine"])
    .range(["#003f5c", "#ffa600", "#739375"]);

  const histMargin = { top: 40, right: 30, bottom: 60, left: 70 };
  const histWidth = 800 - histMargin.left - histMargin.right;
  const histHeight = 300 - histMargin.top - histMargin.bottom;

  const histSvg = d3.select("#histogram")
    .append("svg")
    .attr("width", histWidth + histMargin.left + histMargin.right)
    .attr("height", histHeight + histMargin.top + histMargin.bottom)
    .append("g")
    .attr("transform", `translate(${histMargin.left},${histMargin.top})`);

  let xHistScale = d3.scaleLinear().range([0, histWidth]);
  let yHistScale = d3.scaleLinear().range([histHeight, 0]);

  const xHistAxis = histSvg.append("g")
    .attr("transform", `translate(0,${histHeight})`);
  const yHistAxis = histSvg.append("g");

  histSvg.append("text")
    .attr("class", "x label")
    .attr("x", histWidth / 2)
    .attr("y", histHeight + 45)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text("ΔT (Prize Year - Pub Year)");

  histSvg.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("x", -histHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text("Number of Papers");

  d3.csv("/data/Prize_winning_papers.csv").then(data => {
    data.forEach(d => {
      d["Pub year"] = +d["Pub year"];
      d["Prize year"] = +d["Prize year"];
      d.deltaT = d["Prize year"] - d["Pub year"];
    });

    allData = data;

    drawScatter("All");
    drawHistogram(d3.max(allData, d => d["Prize year"]));

    d3.select("#fieldSelect").on("change", function () {
      drawScatter(this.value);
    });

    d3.select("#yearSlider")
      .attr("min", d3.min(allData, d => d["Prize year"]))
      .attr("max", d3.max(allData, d => d["Prize year"]))
      .property("value", d3.max(allData, d => d["Prize year"]))
      .on("input", function () {
        d3.select("#sliderValue").text(this.value);
        drawHistogram(+this.value);
        stopAnimation();
      });
  });

  function drawScatter(fieldFilter) {
    const filteredData = fieldFilter === "All" ? allData : allData.filter(d => d.Field === fieldFilter);

    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain(d3.extent(allData, d => d["Pub year"]))
      .nice()
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(allData, d => d["Prize year"]))
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
      .call(d3.axisLeft(yScale).tickFormat(d3.format("d")));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Publication Year");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Prize Year");

    svg.selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d["Pub year"]))
      .attr("cy", d => yScale(d["Prize year"]))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.Field))
      .on("mouseover", (event, d) => {
        tooltip2.transition().duration(200).style("opacity", 0.95);
        tooltip2.html(`
          <strong>${d["Laureate name"]}</strong><br>
          <em>${d["Title"]}</em><br>
          <strong>Field:</strong> ${d.Field}<br>
          Pub: ${d["Pub year"]} | Prize: ${d["Prize year"]}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 40) + "px");
      })
      .on("mouseout", () => {
        tooltip2.transition().duration(300).style("opacity", 0);
      })
      .on("click", (event, d) => {
        d3.select("#details-panel").html(`
          <h3>Name: ${d["Laureate name"]}</h3>
          <p><strong>Field:</strong> ${d.Field}</p>
          <p><strong>Laureate ID:</strong> ${d["Laureate ID"]}</p>
          <p><strong>Title:</strong> ${d["Title"]}</p>
          <p><strong>Publication Year:</strong> ${d["Pub year"]}</p>
          <p><strong>Prize Year:</strong> ${d["Prize year"]}</p>
          <p><strong>ΔT:</strong> ${d.deltaT}</p>
        `);
      });

    const legendData = colorScale.domain();
    d3.select("#legend2").selectAll("*").remove();

    const legend = d3.select("#legend2")
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("div")
      .attr("class", "legend2-item");

    legend.append("div")
      .attr("class", "legend2-color")
      .style("background-color", d => colorScale(d));

    legend.append("span")
      .text(d => d);
  }

  function drawHistogram(maxPrizeYear) {
    const filteredData = allData.filter(d => d["Prize year"] <= maxPrizeYear);
    const deltaTs = filteredData.map(d => d.deltaT);
    const maxDeltaT = d3.max(deltaTs);

    xHistScale.domain([0, maxDeltaT]).nice();

    const binsGenerator = d3.bin()
      .domain(xHistScale.domain())
      .thresholds(20);

    const bins = binsGenerator(deltaTs);
    const maxCount = d3.max(bins, d => d.length);
    yHistScale.domain([0, maxCount]).nice();

    xHistAxis.transition().duration(500).call(d3.axisBottom(xHistScale));
    yHistAxis.transition().duration(500).call(d3.axisLeft(yHistScale));

    const bars = histSvg.selectAll("rect")
      .data(bins);

    bars.transition()
      .duration(500)
      .attr("x", d => xHistScale(d.x0) + 1)
      .attr("y", d => yHistScale(d.length))
      .attr("width", d => Math.max(0, xHistScale(d.x1) - xHistScale(d.x0) - 1))
      .attr("height", d => histHeight - yHistScale(d.length))
      .attr("fill", "#69b3a2");

    bars.enter()
      .append("rect")
      .attr("x", d => xHistScale(d.x0) + 1)
      .attr("y", histHeight)
      .attr("width", d => Math.max(0, xHistScale(d.x1) - xHistScale(d.x0) - 1))
      .attr("height", 0)
      .attr("fill", "#69b3a2")
      .transition()
      .duration(500)
      .attr("y", d => yHistScale(d.length))
      .attr("height", d => histHeight - yHistScale(d.length));

    bars.exit()
      .transition()
      .duration(500)
      .attr("y", histHeight)
      .attr("height", 0)
      .remove();
  }

  let animationTimer = null;

  function startAnimation() {
    if (animationTimer !== null) return;
    const slider = d3.select("#yearSlider");
    let currentVal = +slider.property("value");
    const maxVal = +slider.attr("max");

    animationTimer = setInterval(() => {
      if (currentVal >= maxVal) {
        clearInterval(animationTimer);
        animationTimer = null;
        d3.select("#playPauseBtn").text("▶️ Play");
        return;
      }
      currentVal++;
      slider.property("value", currentVal);
      d3.select("#sliderValue").text(currentVal);
      drawHistogram(currentVal);
    }, 100);
  }

  function stopAnimation() {
    if (animationTimer !== null) {
      clearInterval(animationTimer);
      animationTimer = null;
    }
  }

  d3.select("#playPauseBtn").on("click", () => {
    const btn = d3.select("#playPauseBtn");
    if (animationTimer === null) {
      btn.text("⏸ Pause");
      startAnimation();
    } else {
      btn.text("▶️ Play");
      stopAnimation();
    }
  });
})();
