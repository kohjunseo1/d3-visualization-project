(() => {
    const svg = d3.select("svg.network-graph");
    const g = svg.append("g");
    const tooltip = d3.select(".tooltip4");

    const width2 = +svg.attr("width") || 1200;
    const height2 = +svg.attr("height") || 800;

    let simulation;
    let currentNodes = [];
    let currentLinks = [];

    // 选择控制阈值的输入框和显示当前阈值的文本
    const linkThresholdInput = d3.select("#linkThreshold");
    const thresholdValueSpan = d3.select("#thresholdValue");

    // 选择关键词搜索输入框和按钮
    const keywordInput = d3.select("#keywordInput");
    const searchBtn = d3.select("#searchBtn");
    const resetBtn = d3.select("#resetBtn");

    d3.json("visualization_project/data/cooccurrence_network.json").then(function(graph) {

        // 统计每个节点的总权重（与该节点相关的所有连接的value之和）
        const totalLinkCounts = {};
        graph.links.forEach(l => {
            totalLinkCounts[l.source] = (totalLinkCounts[l.source] || 0) + l.value;
            totalLinkCounts[l.target] = (totalLinkCounts[l.target] || 0) + l.value;
        });
        graph.nodes.forEach(n => {
            n.totalWeight = totalLinkCounts[n.id] || 0;
        });

        // 停用词表，用于过滤无意义词
        const stopwords = new Set([
            "a", "an", "the", "and", "or", "but", "if", "while", "with", "at", "by", "for", "from",
            "in", "into", "on", "onto", "of", "off", "out", "over", "to", "up", "down", "as",
            "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
            "will", "would", "shall", "should", "can", "could", "may", "might", "must",
            "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
            "this", "that", "these", "those",
            "not", "no", "yes", "so", "very", "too", "just", "also", "about", "than",
            "good", "bad", "great", "awesome", "nice", "poor", "better", "worst", "some", "any",
            "new", "studies", "study", "result", "results", "based", "using", "used", "use",
            "data", "analysis", "research", "method", "methods", "effect", "effects",
            "findings", "paper", "approach", "approaches",
        ]);

        const uniqueBaseWords = new Map();
        const filteredNodes = graph.nodes.filter(n => {
            const lowerId = n.id.toLowerCase();

            // 排除纯数字、包含非英文字母的词、停用词
            if (/^\d+$/.test(lowerId)) return false;
            if (/[^a-zA-Z\-]/.test(lowerId)) return false;
            if (stopwords.has(lowerId)) return false;

            // 词形还原（如复数等）
            let base = lowerId;
            if (base.endsWith("ies")) {
                base = base.slice(0, -3) + "y";
            } else if (base.endsWith("es")) {
                base = base.slice(0, -2);
            } else if (base.endsWith("s")) {
                base = base.slice(0, -1);
            }

            // 去重
            if (uniqueBaseWords.has(base)) return false;
            uniqueBaseWords.set(base, true);

            return true;
        });

        // 过滤图中无效节点和边（连接的节点必须都在保留列表中）
        const validNodeIds = new Set(filteredNodes.map(n => n.id));
        graph.nodes = filteredNodes;
        graph.links = graph.links.filter(l => validNodeIds.has(l.source) && validNodeIds.has(l.target));

        // 节点颜色比例尺（根据出现频次着色）
        const nodeColorScale = d3.scaleLinear()
            .domain(d3.extent(graph.nodes, d => d.totalWeight))
            .range(["#bbdefb", "#1565c0"]);  

        // 边的颜色比例尺（根据共现频次着色）
        const linkColorScale = d3.scaleLinear()
            .domain(d3.extent(graph.links, d => d.value))
            .range(["#ccc", "#d62728"]);

        // 根据阈值过滤图数据
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

        // 更新图形的绘制
        function updateGraph(nodes, links) {
            currentNodes = nodes;
            currentLinks = links;

            if (simulation) simulation.stop();
            tooltip.style("display", "none");

            g.selectAll(".link").transition().duration(300).style("opacity", 0).remove();
            g.selectAll(".node").transition().duration(300).style("opacity", 0).remove();

            simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).distance(60))
                .force("charge", d3.forceManyBody().strength(-300))
                .force("center", d3.forceCenter(width2 / 2, height2 / 2));

            // 绘制边
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
                .transition().duration(600).style("opacity", 1);

            // 绘制节点
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
                .transition().duration(600).style("opacity", 1);

            // 力导向图位置更新
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

        // 初始化图形
        const initialThreshold = +linkThresholdInput.property("value");
        thresholdValueSpan.text(initialThreshold);
        updateGraphWithThreshold(initialThreshold);

        // 阈值变化时更新图形
        linkThresholdInput.on("input", function() {
            const val = +this.value;
            thresholdValueSpan.text(val);
            updateGraphWithThreshold(val);
        });

        // 缩放与初始视角
        const zoom = d3.zoom()
            .scaleExtent([0.2, 10])
            .on("zoom", (event) => g.attr("transform", event.transform));
        svg.call(zoom);

        const initialScale = 0.5;
        const initialTranslateX = width2 / 2 * (1 - initialScale);
        const initialTranslateY = height2 / 2 * (1 - initialScale);
        svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslateX, initialTranslateY).scale(initialScale));

        // 搜索关键词时高亮节点
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