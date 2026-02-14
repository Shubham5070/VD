let currentStep = 1;
let answers = JSON.parse(localStorage.getItem("valAnswers")) || {};

function nextStep() {
  document.getElementById(`step-${currentStep}`).classList.remove("active");
  currentStep++;
  document.getElementById(`step-${currentStep}`).classList.add("active");
}

function selectAnswer(question, value) {
  answers[question] = value;
  localStorage.setItem("valAnswers", JSON.stringify(answers));
  nextStep();

  if (currentStep === 4) {
    generateFinalMessage();
  }
}

function generateFinalMessage() {
  let message = "With you, every moment feels magical. ";

  if (answers.date === "candle") {
    message += "I imagine us under candlelight, smiling endlessly. ";
  } else if (answers.date === "movie") {
    message += "I imagine us laughing during our cozy movie night. ";
  } else if (answers.date === "longdrive") {
    message += "I imagine us on a peaceful long drive under the stars. ";
  }

  if (answers.vibe === "soft") {
    message += "You make everything feel soft and beautiful. 💕";
  } else if (answers.vibe === "funny") {
    message += "You make life so much fun and joyful. 😄";
  } else if (answers.vibe === "deep") {
    message += "You make my world meaningful and full of depth. 🌌";
  }

  document.getElementById("final-message").innerText = message;
}

document.querySelector(".yes").addEventListener("click", () => {
  document.querySelector(".proposal").innerHTML =
    "<h1>YAYYYY 💍❤️</h1><p>You just made me the happiest person alive!</p>";
});

document.querySelector(".no").addEventListener("mouseover", function() {
  this.style.position = "absolute";
  this.style.top = Math.random() * 80 + "%";
  this.style.left = Math.random() * 80 + "%";
});
