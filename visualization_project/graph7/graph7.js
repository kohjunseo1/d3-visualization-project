(() => { 
    const width = 700;
    const height = 500;
    const svg = d3.select("#cloud")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    let wordData = {};
    let isPlaying = false;
    let intervalId = null;
    let prevWordsText = [];

    const fieldToFile = {
    all: "visualization_project/data/yearly_keywords_all.json",
    chem: "visualization_project/data/yearly_keywords_chem.json",
    phys: "visualization_project/data/yearly_keywords_phys.json",
    med: "visualization_project/data/yearly_keywords_med.json"
    };

    let currentField = "all";
    let years = [];
    let minYear, maxYear;

    const slider = d3.select("#year-slider");
    const yearLabel = d3.select("#year-label");
    const fieldSelect = d3.select("#field-select");

    // 분야 선택 시 데이터 로드 (슬라이더 값 유지)
    function loadData(field, keepYear = null) {
    d3.json(fieldToFile[field]).then(data => {
        wordData = {};
        data.forEach(entry => {
        wordData[entry.year] = entry.words;
        });

        years = Object.keys(wordData).map(d => +d).sort((a, b) => a - b);
        minYear = d3.min(years);
        maxYear = d3.max(years);

        slider.attr("min", minYear).attr("max", maxYear);

        let yearToUse = keepYear && keepYear >= minYear && keepYear <= maxYear
                        ? keepYear : minYear;

        slider.property("value", yearToUse);
        yearLabel.text(yearToUse);
        prevWordsText = [];
        drawWordCloud(wordData[yearToUse]);
    });
    }

    // 슬라이더 변경 시
    slider.on("input", function () {
    const selectedYear = +this.value;
    yearLabel.text(selectedYear);
    drawWordCloud(wordData[selectedYear]);
    });

    // 재생 버튼
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

    // 분야 변경 시 기존 년도 유지
    fieldSelect.on("change", function () {
    const selectedYear = +slider.property("value");
    currentField = this.value;
    prevWordsText = [];
    loadData(currentField, selectedYear);  // 현재 슬라이더 값 유지
    });

    // 초기 로드
    loadData(currentField);

    // 워드클라우드 그리기
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
            if (!prevWordsText.includes(d.text)) return "red";
            return d3.schemeTableau10[Math.floor(Math.random() * 10)];
        })
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);

        prevWordsText = currentWordsText;
    }
    }
})();