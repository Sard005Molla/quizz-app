let questions = [];

function addQuestion(){
    const i = questions.length;

    const div = document.createElement("div");
    div.setAttribute("id", "block"+i);

    div.innerHTML = `
        <input id="q${i}" placeholder="Question"><br>
        <input id="a${i}" placeholder="Option A"><br>
        <input id="b${i}" placeholder="Option B"><br>
        <input id="c${i}" placeholder="Option C"><br>
        <input id="d${i}" placeholder="Option D"><br>

        <label>Correct Answer:</label>
        <select id="correct${i}">
            <option value="0">A</option>
            <option value="1">B</option>
            <option value="2">C</option>
            <option value="3">D</option>
        </select>

        <button onclick="removeQuestion(${i})">Delete Question</button>
        <hr>
    `;

    document.getElementById("questions").appendChild(div);
    questions.push(i);
}

function removeQuestion(i){
    document.getElementById("block"+i).remove();
    questions = questions.filter(q => q !== i);
}

function saveQuiz(){
    const title = document.getElementById("title").value;

    // ❗ VALIDATION: at least 5 questions
    if (questions.length < 5) {
        alert("Cannot create a quiz without making at LEAST 5 questions...");
        return;
    }

    const qs = questions.map(i => {
        const question = document.getElementById(`q${i}`).value;
        const a = document.getElementById(`a${i}`).value;
        const b = document.getElementById(`b${i}`).value;
        const c = document.getElementById(`c${i}`).value;
        const d = document.getElementById(`d${i}`).value;
        const correct = document.getElementById(`correct${i}`).value;

        // ❗ VALIDATION: no empty fields
        if (!question || !a || !b || !c || !d) {
            alert("Please fill all fields for every question.");
            throw new Error("Empty fields");
        }

        return {
            question: question,
            options: [a, b, c, d],
            correct: parseInt(correct)
        };
    });

    let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    quizzes.push({
        id: Date.now(),
        title: title || "Untitled Quiz",
        questions: qs
    });

    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    window.location = "index.html";
}