(() => { 
    const svg = d3.select("svg.network-graph");
    const g = svg.append("g");
    const tooltip = d3.select(".tooltip4");

    const width2 = +svg.attr("width") || 1200;
    const height2 = +svg.attr("height") || 800;

    let simulation;
    let currentNodes = [];
    let currentLinks = [];

    const linkThresholdInput = d3.select("#linkThreshold");
    const thresholdValueSpan = d3.select("#thresholdValue");

    const keywordInput = d3.select("#keywordInput");
    const searchBtn = d3.select("#searchBtn");
    const resetBtn = d3.select("#resetBtn");

    d3.json("data/cooccurrence_network.json").then(function(graph) {
    const totalLinkCounts = {};
    graph.links.forEach(l => {
        totalLinkCounts[l.source] = (totalLinkCounts[l.source] || 0) + l.value;
        totalLinkCounts[l.target] = (totalLinkCounts[l.target] || 0) + l.value;
    });
    graph.nodes.forEach(n => {
        n.totalWeight = totalLinkCounts[n.id] || 0;
    });

    const nodeColorScale = d3.scaleLinear()
        .domain(d3.extent(graph.nodes, d => d.totalWeight))
        .range(["#fff9c4", "#fbc02d"]);

    const linkColorScale = d3.scaleLinear()
        .domain(d3.extent(graph.links, d => d.value))
        .range(["#ccc", "#d62728"]);

    function filterData(threshold) {
        const filteredLinks = graph.links.filter(l => l.value >= threshold);
        const connectedIds = new Set();
        filteredLinks.forEach(l => {
        connectedIds.add(l.source);
        connectedIds.add(l.target);
        });
        const filteredNodes = graph.nodes.filter(n => connectedIds.has(n.id));
        const nodeById = new Map(filteredNodes.map(n => [n.id, n]));
        const linksWithNodes = filteredLinks.map(l => ({
        source: nodeById.get(l.source),
        target: nodeById.get(l.target),
        value: l.value
        }));
        return { nodes: filteredNodes, links: linksWithNodes };
    }

    function updateGraph(nodes, links) {
        currentNodes = nodes;
        currentLinks = links;

        if (simulation) simulation.stop();
        tooltip.style("display", "none");

        // 페이드 아웃 후 삭제
        g.selectAll(".link").transition().duration(300).style("opacity", 0).remove();
        g.selectAll(".node").transition().duration(300).style("opacity", 0).remove();

        simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(60))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width2 / 2, height2 / 2));

        const link = g.append("g").attr("class", "links").selectAll("line")
        .data(links, d => d.source.id + "-" + d.target.id)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("stroke", d => linkColorScale(d.value))
        .style("opacity", 0)
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
            .html(`"${d.source.id}" ↔ "${d.target.id}"<br/>共现次数: ${d.value}`);
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"))
        .transition().duration(600).style("opacity", 1);  // 페이드 인

        const node = g.append("g").attr("class", "nodes").selectAll("circle")
        .data(nodes, d => d.id)
        .enter().append("circle")
        .attr("r", d => Math.sqrt(d.totalWeight + 1) * 2.5)
        .attr("fill", d => nodeColorScale(d.totalWeight))
        .attr("class", "node")
        .style("opacity", 0)
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
            .html(`关键词: ${d.id}<br/>出现次数: ${d.totalWeight}`);
        })
        .on("mousemove", event => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("display", "none"))
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .transition().duration(600).style("opacity", 1);  // 페이드 인

        simulation.on("tick", () => {
        g.selectAll("line.link")
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        g.selectAll("circle.node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        });
    }

    function updateGraphWithThreshold(threshold) {
        const filtered = filterData(threshold);
        updateGraph(filtered.nodes, filtered.links);
    }

    const initialThreshold = +linkThresholdInput.property("value");
    thresholdValueSpan.text(initialThreshold);
    updateGraphWithThreshold(initialThreshold);

    linkThresholdInput.on("input", function() {
        const val = +this.value;
        thresholdValueSpan.text(val);
        updateGraphWithThreshold(val);
    });

    const zoom = d3.zoom()
        .scaleExtent([0.2, 10])
        .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    // 초기 줌 레벨과 위치 지정 (전체 보기 좋게)
    const initialScale = 0.5;  // 0.5면 더 멀리서 봄, 1보다 작게 지정
    const initialTranslateX = width2 / 2 * (1 - initialScale);
    const initialTranslateY = height2 / 2 * (1 - initialScale);
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));

    // 검색 버튼
    searchBtn.on("click", () => {
        const keyword = keywordInput.property("value").trim().toLowerCase();
        if (!keyword) return resetHighlight();

        const matchedNodes = currentNodes.filter(n => n.id.toLowerCase().includes(keyword));
        if (matchedNodes.length === 0) return resetHighlight();

        const matchedNodeIds = new Set(matchedNodes.map(n => n.id));
        const neighborNodeIds = new Set();
        currentLinks.forEach(l => {
        if (matchedNodeIds.has(l.source.id)) neighborNodeIds.add(l.target.id);
        if (matchedNodeIds.has(l.target.id)) neighborNodeIds.add(l.source.id);
        });
        const visibleNodeIds = new Set([...matchedNodeIds, ...neighborNodeIds]);

        g.selectAll("circle.node")
        .transition().duration(500)
        .style("opacity", d => visibleNodeIds.has(d.id) ? 1 : 0.1)
        .attr("stroke", d => matchedNodeIds.has(d.id) ? "orange" : null)
        .attr("stroke-width", d => matchedNodeIds.has(d.id) ? 2 : 0);

        g.selectAll("line.link")
        .transition().duration(500)
        .style("opacity", d =>
            matchedNodeIds.has(d.source.id) || matchedNodeIds.has(d.target.id) ? 1 :
            (neighborNodeIds.has(d.source.id) && neighborNodeIds.has(d.target.id)) ? 1 : 0.05)
        .attr("stroke", d =>
            matchedNodeIds.has(d.source.id) || matchedNodeIds.has(d.target.id) ? "#ff7f0e" : linkColorScale(d.value));
    });

    resetBtn.on("click", resetHighlight);

    function resetHighlight() {
        keywordInput.property("value", "");
        g.selectAll("circle.node")
        .transition().duration(500)
        .style("opacity", 1)
        .attr("stroke", null)
        .attr("stroke-width", 0);
        g.selectAll("line.link")
        .transition().duration(500)
        .style("opacity", 1)
        .attr("stroke", d => linkColorScale(d.value));
    }
    });

    function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    }

    function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
    }

    function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    }
})();