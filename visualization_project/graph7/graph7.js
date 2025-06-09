(() => { 
    const width = 700;  // SVG宽度
    const height = 500; // SVG高度
    const svg = d3.select("#cloud")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let wordData = {};  // 年份词数据
    let isPlaying = false;  // 播放状态
    let intervalId = null;  // 定时器ID
    let prevWordsText = []; // 之前词文本

    // 领域对应数据文件
    const fieldToFile = {
        all: "visualization_project/data/yearly_keywords_all.json",
        chem: "visualization_project/data/yearly_keywords_chem.json",
        phys: "visualization_project/data/yearly_keywords_phys.json",
        med: "visualization_project/data/yearly_keywords_med.json"
    };

    let currentField = "all"; // 当前领域
    let years = [], minYear, maxYear; // 年份相关

    const slider = d3.select("#year-slider"); // 年份滑块
    const yearLabel = d3.select("#year-label"); // 显示年份
    const fieldSelect = d3.select("#field-select"); // 领域选择

    // 加载数据，field领域，keepYear保持年份
    function loadData(field, keepYear = null) {
        d3.json(fieldToFile[field]).then(data => {
            wordData = {};
            data.forEach(entry => {
                if (+entry.year >= 1950) {
                    wordData[entry.year] = entry.words;
                }
            });

            years = Object.keys(wordData).map(d => +d).sort((a, b) => a - b);
            minYear = d3.min(years);
            maxYear = d3.max(years);

            slider.attr("min", minYear).attr("max", maxYear).attr("step", 1);

            let yearToUse = (keepYear && keepYear >= minYear && keepYear <= maxYear)
                            ? keepYear : minYear;

            slider.property("value", yearToUse);
            yearLabel.text(yearToUse);
            prevWordsText = [];
            drawWordCloud(wordData[yearToUse]);
        });
    }

    slider.on("input", function () {
        const selectedYear = +this.value;
        yearLabel.text(selectedYear);
        drawWordCloud(wordData[selectedYear]);
    });

    d3.select("#play-btn").on("click", function () {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? "⏸ Pause" : "▶ Play";

        if (isPlaying) {
            intervalId = setInterval(() => {
                let currentYear = +slider.property("value");
                const nextYear = currentYear + 1;

                if (nextYear > maxYear) {
                    clearInterval(intervalId);
                    isPlaying = false;
                    d3.select("#play-btn").text("▶ Play");
                    return;
                }

                slider.property("value", nextYear);
                yearLabel.text(nextYear);
                drawWordCloud(wordData[nextYear]);
            }, 1000);
        } else {
            clearInterval(intervalId);
        }
    });

    fieldSelect.on("change", function () {
        const selectedYear = +slider.property("value");
        currentField = this.value;
        prevWordsText = [];
        loadData(currentField, selectedYear);
    });

    loadData(currentField);

    // 画词云函数
    function drawWordCloud(words) {
        if (!words) return;

        svg.selectAll("*").remove();
        const currentWordsText = words.map(d => d.text);

        const layout = d3.layout.cloud()
            .size([width, height])
            .words(words.map(d => Object.assign({}, d)))
            .padding(5)
            .rotate(() => 0)
            .fontSize(d => 10 + d.size * 5)
            .on("end", draw);

        layout.start();

        function draw(words) {
            svg.append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`)
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("fill", d => {
                    if (!prevWordsText.includes(d.text)) return "red"; // 新词红色
                    return d3.schemeTableau10[Math.floor(Math.random() * 10)];
                })
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                .text(d => d.text);

            prevWordsText = currentWordsText;
        }
    }
})();

