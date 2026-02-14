let currentStep = 1;
let answers = {};

function showStep(stepNumber){
document.querySelectorAll('.step').forEach(step=>{
step.classList.remove('active');
});
document.getElementById(`step-${stepNumber}`).classList.add('active');
currentStep = stepNumber;
}

function saveName(){
let name = document.getElementById("herName").value.trim();
if(name === ""){
alert("Please tell me what to call you ❤️");
return;
}
answers.name = name;
nextStep();
}

function nextStep(){
showStep(currentStep + 1);
}

function selectAnswer(question,value){
answers[question] = value;
nextStep();

if(currentStep === 5){
generateFinalMessage();
}
}

function generateFinalMessage(){
let name = answers.name || "You";
let message = `${name}, from Sarakki Lake mornings to CAT preparation nights… `;

if(answers.date === "run"){
message += "I imagine trying to match your running pace. ";
}
else if(answers.date === "badminton"){
message += "I imagine losing badminton to you proudly. ";
}
else{
message += "I imagine peaceful walks near the lake with you. ";
}

if(answers.food === "mushroom"){
message += "No paneer ever — only mushroom supremacy. ";
}
else if(answers.food === "ghar"){
message += "Simple ghar ka khana, just how you like life. ";
}
else{
message += "Chocolate date, but only 2-3 bites because sweetness limit. ";
}

if(answers.evening === "series"){
message += "No more watching Stranger Things alone. ";
}
else if(answers.evening === "sing"){
message += "I’ll listen to you sing like your musical family. ";
}
else{
message += "Deep talks about life being simple yet unpredictable. ";
}

message += "You once said I never asked properly… so here I am, properly asking. 💕";

document.getElementById("finalMessage").innerText = message;
}

function sayYes(){
document.querySelector(".proposal").innerHTML =
"<h1>She Said YES 💍❤️</h1><p>Even Sarakki Lake is celebrating right now.</p>";
}

function moveButton(button){
button.style.position = "absolute";
button.style.top = Math.random()*80 + "%";
button.style.left = Math.random()*80 + "%";
}
