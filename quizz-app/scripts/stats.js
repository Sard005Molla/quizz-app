function renderMessage(text, type = "info"){
    const box = document.getElementById("statsMessage");
    box.textContent = text;
    box.className = `message ${type}`;
}

function load(){
    fetch("php/getStats.php")
    .then(res=>res.json())
    .then(data=>{
        const cards = document.getElementById("statsCards");
        const recent = document.getElementById("recentResults");
        cards.innerHTML = "";
        recent.innerHTML = "";

        if(!data.loggedIn){
            renderMessage(data.message || "Log in to see your saved quiz stats.", "info");
            return;
        }

        if(data.count === 0){
            renderMessage("No saved quiz results yet. Take a database quiz while logged in and your stats will appear here.", "info");
            return;
        }

        renderMessage(`Stats for ${data.username}`, "success");
        cards.innerHTML = `
            <div class="stat-card"><span>Attempts</span><strong>${data.count}</strong></div>
            <div class="stat-card"><span>Average</span><strong>${data.average.toFixed(1)}%</strong></div>
            <div class="stat-card"><span>Best</span><strong>${data.best.toFixed(1)}%</strong></div>
        `;

        recent.innerHTML = "<h3>Recent Results</h3>" + data.results.slice(0, 5).map(r => `
            <div class="result-row">
                <span>${r.score}/${r.total}</span>
                <strong>${r.percent.toFixed(1)}%</strong>
            </div>
        `).join("");
    })
    .catch(()=>{
        renderMessage("Could not load stats. Please make sure MySQL is running.", "error");
    });
}

document.addEventListener("DOMContentLoaded", load);