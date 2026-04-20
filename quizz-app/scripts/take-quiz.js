let quiz, i=0, score=0;
let answers = [];

function load(){
    const id=parseInt(localStorage.getItem("currentQuiz"));
    const quizzes=JSON.parse(localStorage.getItem("quizzes"));
    quiz=quizzes.find(q=>q.id===id);

    document.getElementById("title").innerText=quiz.title;
    show();
}

function show(){
    const q=quiz.questions[i];
    let html=`<h3>${q.question}</h3>`;

    q.options.forEach((o,index)=>{
        html+=`<div><input type="radio" name="a" value="${index}"> ${o}</div>`;
    });

    document.getElementById("qbox").innerHTML=html;
}

function next(){
    const sel = document.querySelector("input[name='a']:checked");

    answers[i] = sel ? parseInt(sel.value) : -1;

    if(sel && parseInt(sel.value) === quiz.questions[i].correct){
        score++;
    }

    i++;

    if(i < quiz.questions.length){
        show();
    } else {
        localStorage.setItem("score", score);
        localStorage.setItem("total", quiz.questions.length);
        localStorage.setItem("answers", JSON.stringify(answers));
        localStorage.setItem("quizData", JSON.stringify(quiz));
        window.location="results.html";
    }
}

document.addEventListener("DOMContentLoaded",load);