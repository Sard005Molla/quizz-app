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

    if (questions.length < 5) {
        alert("Cannot create a quiz without making at LEAST 5 questions...");
        return;
    }

    const qs = questions.map(i => ({
        question: document.getElementById(`q${i}`).value,
        options: [
            document.getElementById(`a${i}`).value,
            document.getElementById(`b${i}`).value,
            document.getElementById(`c${i}`).value,
            document.getElementById(`d${i}`).value
        ],
        correct: parseInt(document.getElementById(`correct${i}`).value)
    }));

    fetch("php/saveQuiz.php", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            title: title,
            questions: qs
        })
    })
    .then(r=>r.text())
    .then(res=>{
        alert(res);
        window.location="index.html";
    });
}