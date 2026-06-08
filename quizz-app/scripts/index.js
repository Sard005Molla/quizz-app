function loadQuizzes(){
    fetch("php/getQuizzes.php")
    .then(res=>res.json())
    .then(quizzes=>{
        const table = document.getElementById("quizTable");
        table.innerHTML = "";

        quizzes.forEach(q=>{
            table.innerHTML += `
            <tr>
                <td>${q.title}</td>
                <td>
                    <button onclick='startQuiz(${JSON.stringify(q)})'>Start</button>
                </td>
            </tr>`;
        });
    });
}

function loadAPIQuiz(){
    fetch("php/quickQuiz.php?amount=5")
    .then(res=>res.json())
    .then(q=>{
        if(!q.questions || q.questions.length === 0){
            alert("Could not load API questions right now. Please try again.");
            return;
        }

        startQuiz(q);
    })
    .catch(()=>{
        alert("Could not connect to the quiz API.");
    });
}

function startQuiz(q){
    localStorage.setItem("quizData", JSON.stringify(q));
    window.location = "take-quiz.html";
}

document.addEventListener("DOMContentLoaded", loadQuizzes);
