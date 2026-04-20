function loadQuizzes(){
    const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const table = document.getElementById("quizTable");
    table.innerHTML = "";

    quizzes.forEach(q=>{
        table.innerHTML += `
        <tr>
            <td>${q.title}</td>
            <td>
                <button onclick="startQuiz(${q.id})">Start</button>
                <button onclick="editQuiz(${q.id})">Edit</button>
                <button onclick="deleteQuiz(${q.id})">Delete</button>
            </td>
        </tr>`;
    });
}

function startQuiz(id){
    localStorage.setItem("currentQuiz", id);
    window.location = "take-quiz.html";
}

function editQuiz(id){
    localStorage.setItem("editQuizId", id);
    window.location = "create-quiz.html";
}

function deleteQuiz(id){
    let quizzes = JSON.parse(localStorage.getItem("quizzes"));
    quizzes = quizzes.filter(q=>q.id!==id);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    loadQuizzes();
}


async function loadAPIQuiz(){
    const amount = Math.floor(Math.random() * 6) + 5;

    const res = await fetch(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
    const data = await res.json();

    const quiz = {
        id: Date.now(),
        title: "Quick Challenge Quiz",
        questions: data.results.map(q=>{
            const opts = [...q.incorrect_answers, q.correct_answer];
            opts.sort(()=>Math.random()-0.5);

            return {
                question: q.question,
                options: opts,
                correct: opts.indexOf(q.correct_answer)
            };
        })
    };

    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    quizzes.push(quiz);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    alert(`Quiz with ${amount} questions added!`);
    loadQuizzes();
}

document.addEventListener("DOMContentLoaded", loadQuizzes);