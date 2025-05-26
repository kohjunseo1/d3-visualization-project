const margin = { top: 50, right: 50, bottom: 50, left: 60 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart1")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
             .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
                  .attr("class", "tooltip1")
                  .style("opacity", 0);

d3.csv("data/linechart_data.csv").then(data => {
  data.forEach(d => {
    d.RelYear = +d.RelYear;
    d.AvgPerYear = +d.AvgPerYear;
  });

  const x = d3.scaleLinear()
              .domain(d3.extent(data, d => d.RelYear))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.AvgPerYear)]).nice()
              .range([height, 0]);

  const xAxisGroup = g.append("g").attr("transform", `translate(0, ${height})`);
  const yAxisGroup = g.append("g");

  const xAxis = d3.axisBottom(x).ticks(10);
  const yAxis = d3.axisLeft(y);

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  // Background area coloring
  g.append("rect")
   .attr("x", 0)
   .attr("y", 0)
   .attr("width", x(0))
   .attr("height", height)
   .attr("fill", "#f0f8ff");

  g.append("rect")
   .attr("x", x(0))
   .attr("y", 0)
   .attr("width", width - x(0))
   .attr("height", height)
   .attr("fill", "#fffaf0");

  // 기준선과 텍스트
  const zeroLine = g.append("line")
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "4 2");

  const zeroText = g.append("text")
                    .attr("fill", "red")
                    .style("font-weight", "bold")
                    .style("font-size", "13px")
                    .text("诺奖得奖年份");

  g.append("text")
   .attr("x", x(0) / 2)
   .attr("y", 20)
   .text("得奖前")
   .attr("fill", "#333")
   .style("font-size", "14px");

  g.append("text")
   .attr("x", x(0) + (width - x(0)) / 2)
   .attr("y", 20)
   .text("得奖后")
   .attr("fill", "#333")
   .style("font-size", "14px");

  const avgValue = d3.mean(data, d => d.AvgPerYear);

  const avgLine = g.append("line")
    .attr("class", "avg-line")
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4 4")
    .on("mouseover", (event) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`平均值: ${avgValue.toFixed(2)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  const avgText = g.append("text")
                   .attr("fill", "green")
                   .style("font-size", "13px")
                   .style("font-weight", "bold")
                   .text("平均值");

  const zoomGroup = g.append("g").attr("class", "zoom-layer");

  const line = d3.line()
                 .x(d => x(d.RelYear))
                 .y(d => y(d.AvgPerYear));

  const path = zoomGroup.append("path")
     .datum(data)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2)
     .attr("d", line);

  const dots = zoomGroup.selectAll("circle")
     .data(data)
     .enter().append("circle")
     .attr("cx", d => x(d.RelYear))
     .attr("cy", d => y(d.AvgPerYear))
     .attr("r", 4)
     .attr("fill", "orange")
     .on("mouseover", (event, d) => {
       const yearLabel = d.RelYear > 0 ? `+${d.RelYear}` : d.RelYear;
       tooltip.transition().duration(200).style("opacity", 0.9);
       tooltip.html(`Year: ${yearLabel}<br>Avg: ${d.AvgPerYear.toFixed(2)}`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
     })
     .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", (event) => {
      const transform = event.transform;
      const zx = transform.rescaleX(x);
      const zy = transform.rescaleY(y);

      xAxisGroup.call(d3.axisBottom(zx).ticks(10));
      yAxisGroup.call(d3.axisLeft(zy));

      path.attr("d", d3.line()
        .x(d => zx(d.RelYear))
        .y(d => zy(d.AvgPerYear)));

      dots.attr("cx", d => zx(d.RelYear))
          .attr("cy", d => zy(d.AvgPerYear));

      zeroLine
        .attr("x1", zx(0))
        .attr("x2", zx(0))
        .attr("y1", 0)
        .attr("y2", height);

      zeroText
        .attr("x", zx(0) - 40)
        .attr("y", -10);

      avgLine
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", zy(avgValue))
        .attr("y2", zy(avgValue));

      avgText
        .attr("x", width - 80)
        .attr("y", zy(avgValue) - 6);
    });

  // 초기 위치
  zeroLine.attr("x1", x(0)).attr("x2", x(0)).attr("y1", 0).attr("y2", height);
  zeroText.attr("x", x(0) - 40).attr("y", -10);
  avgLine.attr("x1", 0).attr("x2", width).attr("y1", y(avgValue)).attr("y2", y(avgValue));
  avgText.attr("x", width - 80).attr("y", y(avgValue) - 6);

  svg.call(zoom);
});
