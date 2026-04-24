let quiz, i = 0, score = 0;
let answers = [];

function load(){
    const id = parseInt(localStorage.getItem("currentQuiz"));
    const quizzes = JSON.parse(localStorage.getItem("quizzes"));
    quiz = quizzes.find(q => q.id === id);

    document.getElementById("title").innerText = quiz.title;
    answers = new Array(quiz.questions.length).fill(-1);

    show();
}

function show(){
    const q = quiz.questions[i];

    // Counter
    document.getElementById("counter").innerText =
        `Question ${i + 1} / ${quiz.questions.length}`;

    let html = `<h3>${q.question}</h3>`;

    q.options.forEach((o, index) => {
        const checked = answers[i] === index ? "checked" : "";
        html += `
        <div>
            <input type="radio" name="a" value="${index}" ${checked}>
            ${o}
        </div>`;
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

function finishQuiz(){
    localStorage.setItem("score", score);
    localStorage.setItem("total", quiz.questions.length);
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("quizData", JSON.stringify(quiz));

    window.location = "results.html";
}

function updateProgressBar(){
    const progress = ((i + 1) / quiz.questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

function updateButtons(){
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    // Hide Next on last question
    if(i === quiz.questions.length - 1){
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "inline-block";
    }

    // Hide Back on first question
    if(i === 0){
        backBtn.style.visibility = "hidden";
    } else {
        backBtn.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", load);