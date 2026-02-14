document.addEventListener("DOMContentLoaded", function(){

let currentStep = 1;
let answers = {};

function showStep(step){
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-" + step).classList.add("active");
  currentStep = step;
}

function nextStep(){
  showStep(currentStep + 1);
}

document.getElementById("continueBtn").addEventListener("click", function(){
  let name = document.getElementById("herName").value.trim();
  if(name === ""){
    alert("Please tell me what to call you ❤️");
    return;
  }
  answers.name = name;
  nextStep();
});

document.querySelectorAll("[data-question]").forEach(btn=>{
  btn.addEventListener("click", function(){
    let question = this.getAttribute("data-question");
    let value = this.getAttribute("data-value");
    answers[question] = value;
    nextStep();

    if(currentStep === 5){
      generateFinalMessage();
    }
  });
});
function generateFinalMessage(){

  let name = answers.name || "You";

  let message = name + ", the more I know you… the more I realize you’re not someone ordinary. ";

  if(answers.comfort === "walk"){
    message += "You find peace in quiet walks and calm spaces — and I’d love to be the person who walks beside you without disturbing that peace. ";
  }
  else if(answers.comfort === "sports"){
    message += "You fight your stress by moving forward — running, playing, pushing yourself. I admire that strength in you. ";
  }
  else{
    message += "You find comfort in music — maybe that’s why even your silence feels melodic. ";
  }

  if(answers.respect === "simplicity"){
    message += "I promise I won’t complicate your simple world. I’d protect that softness. ";
  }
  else if(answers.respect === "goals"){
    message += "Your focus on your goals is powerful… and I’d never distract you, only support you. ";
  }
  else{
    message += "Your faith in Bhagwaan and in destiny makes you grounded. That’s rare. ";
  }

  if(answers.vibe === "soft"){
    message += "With you, I don’t imagine drama — I imagine safety. ";
  }
  else if(answers.vibe === "fun"){
    message += "I imagine teasing you about paneer while ordering mushroom for you. ";
  }
  else{
    message += "I imagine late-night talks about unpredictable life and Barcelona stories. ";
  }

  message += " And when you once said, 'You haven't asked me properly…' — I realized something. ";

  message += "You deserve to be asked with intention. With clarity. With respect. 💕";

  document.getElementById("finalMessage").innerText = message;
}


document.getElementById("yesBtn").addEventListener("click", function(){
  this.innerText = "She Said YES 💍❤️";
});

document.getElementById("noBtn").addEventListener("mouseover", function(){
  this.style.position = "absolute";
  this.style.top = Math.random()*80 + "%";
  this.style.left = Math.random()*80 + "%";
});

});
