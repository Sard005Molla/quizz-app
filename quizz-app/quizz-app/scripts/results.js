function getGrade(score) {
    if (score >= 90) return {grade:"AA", msg:"EXCELLENT!", color:"#2ecc71"};
    if (score >= 85) return {grade:"BA", msg:"NICE!", color:"#7bed9f"};
    if (score >= 80) return {grade:"BB", msg:"SUCCESSFUL!", color:"#00d4ff"};
    if (score >= 75) return {grade:"CB", msg:"NOT BAD", color:"#70a1ff"};
    if (score >= 70) return {grade:"CC", msg:"OK", color:"#70a1ff"};
    if (score >= 65) return {grade:"DC", msg:"PASSED WELL", color:"#ffa502"};
    if (score >= 60) return {grade:"DD", msg:"PASSED", color:"#f1c40f"};
    if (score >= 50) return {grade:"FD", msg:"KEEP PRACTICING", color:"#ff7675"};
    return {grade:"FF", msg:"KEEP PRACTICING", color:"#e74c3c"};
}

function setSaveStatus(text, type = "info"){
    const box = document.getElementById("saveStatus");
    box.textContent = text;
    box.className = `message ${type}`;
}

function escapeHTML(value){
    return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function loadResults() {
    const score = parseInt(localStorage.getItem("score"), 10) || 0;
    const total = parseInt(localStorage.getItem("total"), 10) || 1;

    const percent = (score / total) * 100;
    const g = getGrade(percent);

    document.getElementById("score").innerText = `${score} / ${total} (${percent.toFixed(1)}%)`;
    document.getElementById("grade").innerText = `${g.grade} - ${g.msg}`;
    document.getElementById("grade").style.color = g.color;

    saveStats(percent);
    showSaveStatus();
    showReview();
}

function saveStats(percent){
    let stats = JSON.parse(localStorage.getItem("stats")) || [];
    stats.push(percent);
    localStorage.setItem("stats", JSON.stringify(stats));
}

function showSaveStatus(){
    const raw = localStorage.getItem("lastSaveResult");

    if(!raw){
        setSaveStatus("This quiz was completed as a quick/guest quiz, so it was not added to the leaderboard.", "info");
        return;
    }

    const result = JSON.parse(raw);
    setSaveStatus(result.message || "Result processed.", result.saved ? "success" : "info");
    localStorage.removeItem("lastSaveResult");
}

function showReview(){
    const answers = JSON.parse(localStorage.getItem("answers") || "[]");
    const quiz = JSON.parse(localStorage.getItem("quizData") || "null");

    if(!quiz || !quiz.questions){
        document.getElementById("review").innerHTML = "<p>No quiz review is available.</p>";
        return;
    }

    let html = "<h3>Review</h3>";

    quiz.questions.forEach((q, i)=>{
        const correct = q.correct;
        const user = answers[i];
        const userAnswer = user >= 0 ? q.options[user] : "No answer";

        html += `<div class="review-item"><strong>${escapeHTML(q.question)}</strong><br>`;
        html += `Your answer: ${escapeHTML(userAnswer)}<br>`;
        html += `Correct answer: ${escapeHTML(q.options[correct])}</div>`;
    });

    document.getElementById("review").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", loadResults);