function load(){
    const s=JSON.parse(localStorage.getItem("stats"))||[];
    if(s.length===0){
        document.getElementById("avg").innerText="No data";
        return;
    }

    const avg=s.reduce((a,b)=>a+b,0)/s.length;
    document.getElementById("avg").innerText="Average: "+avg.toFixed(1)+"%";
}

document.addEventListener("DOMContentLoaded",load);