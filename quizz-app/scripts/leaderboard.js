function escapeHTML(value){
    return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

function setMessage(text, type = "info"){
    const box = document.getElementById("leaderboardMessage");
    box.textContent = text;
    box.className = `message ${type}`;
}

function load(){
    fetch("php/leaderboard.php")
    .then(res=>res.json())
    .then(data=>{
        const table = document.getElementById("board");
        table.innerHTML = "";

        if(data.length === 0){
            setMessage("No leaderboard results yet. Logged-in users appear here after completing saved quizzes.", "info");
            return;
        }

        setMessage("Top players by average score", "success");
        data.forEach((u, index)=>{
            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(u.username)}</td>
                <td>${Number(u.avg_score).toFixed(1)}%</td>
                <td>${Number(u.best_score).toFixed(1)}%</td>
                <td>${u.attempts}</td>
            </tr>`;
        });
    })
    .catch(()=>{
        setMessage("Could not load the leaderboard. Please make sure MySQL is running.", "error");
    });
}

document.addEventListener("DOMContentLoaded", load);