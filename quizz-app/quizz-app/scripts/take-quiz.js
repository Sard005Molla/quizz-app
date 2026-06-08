let quiz, i = 0, score = 0;
let answers = [];

function load(){
    const q = JSON.parse(localStorage.getItem("quizData"));
    quiz = q;

    if(!quiz || !quiz.questions || quiz.questions.length === 0){
        document.getElementById("title").innerText = "Quiz unavailable";
        document.getElementById("counter").innerText = "";
        document.getElementById("qbox").innerHTML =
            "<p>This quiz has no questions. Please go back and choose another quiz.</p>";
        document.querySelector(".progress-container").style.display = "none";
        document.querySelector(".status-text").style.display = "none";
        document.querySelector(".nav-buttons").style.display = "none";
        return;
    }

    document.getElementById("title").innerText = quiz.title;
    answers = new Array(quiz.questions.length).fill(-1);

    show();
}

function show(){
    const q = quiz.questions[i];

    document.getElementById("counter").innerText =
        `Question ${i + 1} / ${quiz.questions.length}`;

    let html = `<h3>${q.question}</h3>`;

    q.options.forEach((o, index) => {
        const checked = answers[i] === index ? "checked" : "";
        html += `
        <label class="option-row">
            <input type="radio" name="a" value="${index}" ${checked}>
            ${o}
        </label>`;
    });

    document.getElementById("qbox").innerHTML = html;

    updateProgressBar();
    updateButtons();
}

function next(){
    saveAnswer();

    if(i < quiz.questions.length - 1){
        i++;
        show();
    }
}

function prev(){
    saveAnswer();

    if(i > 0){
        i--;
        show();
    }
}

function endQuiz(){
    saveAnswer();
    calculateScore();
    finishQuiz();
}

function saveAnswer(){
    const sel = document.querySelector("input[name='a']:checked");
    answers[i] = sel ? parseInt(sel.value) : -1;
}

function calculateScore(){
    score = 0;

    quiz.questions.forEach((q, index) => {
        if(answers[index] === q.correct){
            score++;
        }
    });
}

async function finishQuiz(){
    localStorage.setItem("score", score);
    localStorage.setItem("total", quiz.questions.length);
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("quizData", JSON.stringify(quiz));
    localStorage.removeItem("lastSaveResult");

    if(quiz.source !== "api" && quiz.id){
        try {
            const response = await fetch("php/saveResult.php", {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    quiz_id: quiz.id,
                    score: score,
                    total: quiz.questions.length
                })
            });
            const result = await response.json();
            localStorage.setItem("lastSaveResult", JSON.stringify(result));
        } catch (error) {
            localStorage.setItem("lastSaveResult", JSON.stringify({
                saved: false,
                message: "Your score is shown below, but it could not be saved right now."
            }));
        }
    }

    window.location = "results.html";
}

function updateProgressBar(){
    const progress = ((i + 1) / quiz.questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

function updateButtons(){
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    if(i === quiz.questions.length - 1){
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "inline-block";
    }

    if(i === 0){
        backBtn.style.visibility = "hidden";
    } else {
        backBtn.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", load);