document.addEventListener("DOMContentLoaded", function () {

let currentStep = 1;
let totalSteps = 11;
let answers = {};

function showStep(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step-" + step).classList.add("active");
  currentStep = step;
}

function nextStep() {
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  }
}

// Name input
document.getElementById("continueBtn").addEventListener("click", function () {
  let name = document.getElementById("herName").value.trim();
  if (name === "") {
    alert("Tell me what I should call you 🌸");
    return;
  }
  answers.name = name;
  nextStep();
});

// Handle all option clicks
document.querySelectorAll(".options button").forEach(btn => {
  btn.addEventListener("click", function () {

    let questionNumber = currentStep;
    answers["q" + questionNumber] = this.innerText;

    nextStep();

    if (currentStep === 11) {
      generateFinalMessage();
    }
  });
});

function generateFinalMessage() {

  let name = answers.name || "You";

  let message = name + ",\n\n";

  message += "The more I talk to you, the more I realise something important.\n\n";

  message += "You’re calm but strong. Playful but serious where it matters.\n";

  if (answers.q5 && answers.q5.includes("Honesty")) {
    message += "You value honesty deeply — and I don’t want to ever take that lightly.\n";
  }

  if (answers.q8 && answers.q8.includes("Grow")) {
    message += "You believe in growing individually and together — and that’s rare.\n";
  }

  if (answers.q7 && answers.q7.includes("Saaf")) {
    message += "Also… I will behave. Thoda. Maybe.\n";
  }

  message += "\nI don’t want something rushed.\n";
  message += "I don’t want something casual.\n";
  message += "I just want something real.\n\n";
  message += "Steady. Honest. With you. 🤍";

  document.getElementById("finalMessage").innerText = message;
}


// YES button
document.getElementById("yesBtn").addEventListener("click", function () {

  this.innerText = "Okay… this just became official 🤍";
  this.style.background = "#ff4d6d";
  this.style.color = "white";

  document.getElementById("noBtn").style.display = "none";

});


// Playful "Let me think" button (not aggressive)
document.getElementById("noBtn").addEventListener("mouseover", function () {

  this.style.position = "absolute";
  this.style.top = Math.random() * 70 + "%";
  this.style.left = Math.random() * 70 + "%";

});

});
