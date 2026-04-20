function getGrade(score) {
    if (score >= 90) return {grade:"AA", msg:"EXCELLENT!", color:"darkgreen"};
    if (score >= 85) return {grade:"BA", msg:"NICE!", color:"lightgreen"};
    if (score >= 80) return {grade:"BB", msg:"SUCCESSFUL!", color:"blue"};
    if (score >= 75) return {grade:"CB", msg:"NOT BAD", color:"lightblue"};
    if (score >= 70) return {grade:"CC", msg:"OK", color:"lightblue"};
    if (score >= 65) return {grade:"DC", msg:"PASSED WELL", color:"orange"};
    if (score >= 60) return {grade:"DD", msg:"PASSED", color:"yellow"};
    if (score >= 50) return {grade:"FD", msg:"FAIL...", color:"red"};
    return {grade:"FF", msg:"FAIL...", color:"darkred"};
}

function loadResults() {
    const score = parseInt(localStorage.getItem("score")) || 0;
    const total = parseInt(localStorage.getItem("total")) || 1;

    const percent = (score / total) * 100;
    const g = getGrade(percent);

    document.getElementById("score").innerText = `${percent.toFixed(1)}%`;
    document.getElementById("grade").innerText = `${g.grade} - ${g.msg}`;
    document.getElementById("grade").style.color = g.color;

    saveStats(percent);
    showReview();
}

function saveStats(percent){
    let stats = JSON.parse(localStorage.getItem("stats")) || [];
    stats.push(percent);
    localStorage.setItem("stats", JSON.stringify(stats));
}

function showReview(){
    const answers = JSON.parse(localStorage.getItem("answers"));
    const quiz = JSON.parse(localStorage.getItem("quizData"));

    let html = "<h3>Review:</h3>";

    quiz.questions.forEach((q, i)=>{
        const correct = q.correct;
        const user = answers[i];

        html += `<p><strong>${q.question}</strong><br>`;
        html += `Your answer: ${q.options[user] || "None"}<br>`;
        html += `Correct answer: ${q.options[correct]}</p><hr>`;
    });

    document.getElementById("review").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", loadResults);