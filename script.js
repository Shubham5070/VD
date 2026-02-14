document.addEventListener("DOMContentLoaded", function () {
  
  let currentStep = 1;
  let totalSteps = 12;
  let answers = {};
  
  // Memory game state
  let flippedCards = [];
  let matchedPairs = 0;
  let canFlip = true;
  
  // Update progress bar
  function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
  }
  
  // Show step with animation
  function showStep(step) {
    const allSteps = document.querySelectorAll(".step");
    
    // Remove active class with fade out
    allSteps.forEach(s => {
      if (s.classList.contains('active')) {
        s.style.animation = 'slideOut 0.4s ease forwards';
        setTimeout(() => {
          s.classList.remove("active");
          s.style.animation = '';
        }, 400);
      }
    });
    
    // Show new step after delay
    setTimeout(() => {
      const newStep = document.getElementById("step-" + step);
      newStep.classList.add("active");
      currentStep = step;
      updateProgress();
      
      // Initialize memory game if on that step
      if (step === 8) {
        initMemoryGame();
      }
      
      // Trigger heart animation on final step
      if (step === 12) {
        setTimeout(generateFinalMessage, 500);
      }
    }, 450);
  }
  
  function nextStep() {
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  }
  
  // Slide out animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Name input
  document.getElementById("continueBtn").addEventListener("click", function () {
    let name = document.getElementById("herName").value.trim();
    if (name === "") {
      // Shake animation for empty input
      const input = document.getElementById("herName");
      input.style.animation = 'shake 0.5s';
      setTimeout(() => input.style.animation = '', 500);
      
      // Add shake keyframes
      if (!document.getElementById('shake-style')) {
        const shakeStyle = document.createElement('style');
        shakeStyle.id = 'shake-style';
        shakeStyle.textContent = `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `;
        document.head.appendChild(shakeStyle);
      }
      
      return;
    }
    answers.name = name;
    nextStep();
  });
  
  // Allow Enter key for name input
  document.getElementById("herName").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      document.getElementById("continueBtn").click();
    }
  });
  
  // Handle all option clicks (except memory game step)
  document.querySelectorAll(".options button").forEach(btn => {
    btn.addEventListener("click", function () {
      // Skip if this is the memory game step
      if (currentStep === 8) return;
      
      let questionNumber = currentStep;
      answers["q" + questionNumber] = this.querySelector('.text') 
        ? this.querySelector('.text').innerText 
        : this.innerText;
      
      // Add selected animation
      this.style.transform = 'scale(1.1)';
      this.style.background = 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(255, 160, 122, 0.2))';
      
      setTimeout(() => {
        nextStep();
      }, 400);
    });
  });
  
  // Memory Game Logic
  function initMemoryGame() {
    const cards = document.querySelectorAll('.memory-card');
    matchedPairs = 0;
    flippedCards = [];
    canFlip = true;
    
    // Shuffle cards
    const cardsArray = Array.from(cards);
    cardsArray.sort(() => Math.random() - 0.5);
    const parent = cardsArray[0].parentNode;
    cardsArray.forEach(card => parent.appendChild(card));
    
    // Reset cards
    cards.forEach(card => {
      card.classList.remove('flipped', 'matched');
      card.addEventListener('click', flipCard);
    });
    
    document.getElementById('matchCount').textContent = '0';
  }
  
  function flipCard() {
    if (!canFlip) return;
    if (this.classList.contains('flipped')) return;
    if (this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
      canFlip = false;
      checkMatch();
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flippedCards;
    const pair1 = card1.getAttribute('data-pair');
    const pair2 = card2.getAttribute('data-pair');
    
    if (pair1 === pair2) {
      // Match found!
      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('matchCount').textContent = matchedPairs;
        
        flippedCards = [];
        canFlip = true;
        
        // Check if all pairs matched
        if (matchedPairs === 3) {
          setTimeout(() => {
            celebrate();
            setTimeout(nextStep, 1500);
          }, 500);
        }
      }, 600);
    } else {
      // No match
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        canFlip = true;
      }, 1000);
    }
  }
  
  function celebrate() {
    // Add celebration effect to game status
    const status = document.querySelector('.game-status');
    status.innerHTML = '🎉 Perfect! All matched! 🎉';
    status.style.animation = 'pulse 0.5s ease 3';
  }
  
  // Generate final personalized message
  function generateFinalMessage() {
    let name = answers.name || "You";
    
    let message = name + ",\n\n";
    message += "The more I talk to you, the more I realize something important.\n\n";
    message += "You're calm but strong. Playful but serious where it matters.\n";
    
    if (answers.q5 && answers.q5.includes("Honesty")) {
      message += "You value honesty deeply — and I don't want to ever take that lightly.\n";
    }
    
    if (answers.q9 && answers.q9.includes("Grow")) {
      message += "You believe in growing individually and together — and that's rare.\n";
    }
    
    if (answers.q7 && answers.q7.includes("Saaf")) {
      message += "Also... I will behave. Thoda. Maybe. 😌\n";
    }
    
    message += "\nI don't want something rushed.\n";
    message += "I don't want something casual.\n";
    message += "I just want something real.\n\n";
    message += "Steady. Honest. With you. 🤍";
    
    // Display with typing effect
    typeMessage(message);
  }
  
  function typeMessage(message) {
    const element = document.getElementById("finalMessage");
    element.innerText = '';
    let i = 0;
    
    function type() {
      if (i < message.length) {
        element.innerText += message.charAt(i);
        i++;
        setTimeout(type, 30);
      }
    }
    
    type();
  }
  
  // YES button with confetti
  document.getElementById("yesBtn").addEventListener("click", function () {
    this.innerHTML = '<span>This just became official 🤍✨</span>';
    this.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
    this.style.color = 'white';
    this.style.transform = 'scale(1.1)';
    
    document.getElementById("noBtn").style.display = 'none';
    
    // Trigger confetti
    launchConfetti();
    
    // Add success message
    setTimeout(() => {
      const successMsg = document.createElement('p');
      successMsg.textContent = '💕 Thank you for giving us a chance 💕';
      successMsg.style.cssText = `
        margin-top: 20px;
        font-size: 18px;
        color: var(--primary);
        font-weight: 600;
        animation: revealText 0.8s ease forwards;
      `;
      document.querySelector('.final-buttons').appendChild(successMsg);
    }, 1000);
  });
  
  // Playful "Let me think" button - runs away!
  const noBtn = document.getElementById("noBtn");
  let clickCount = 0;
  
  noBtn.addEventListener("click", function(e) {
    clickCount++;
    
    if (clickCount === 1) {
      this.textContent = "Are you sure? 🥺";
    } else if (clickCount === 2) {
      this.textContent = "Give it a chance? 💭";
    } else if (clickCount >= 3) {
      this.textContent = "Okay okay... thinking! 😅";
      // Make it run away
      runAway(e);
    }
  });
  
  noBtn.addEventListener("mouseenter", function() {
    if (clickCount >= 2) {
      runAway();
    }
  });
  
  function runAway(e) {
    const btn = document.getElementById("noBtn");
    const container = document.querySelector('.card');
    const containerRect = container.getBoundingClientRect();
    
    // Random position within card bounds
    const maxX = containerRect.width - btn.offsetWidth - 40;
    const maxY = containerRect.height - btn.offsetHeight - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btn.style.position = "absolute";
    btn.style.left = randomX + "px";
    btn.style.top = randomY + "px";
    btn.style.transition = "all 0.3s ease";
  }
  
  // Confetti animation
  function launchConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const confetti = [];
    const confettiCount = 150;
    const colors = ['#ff6b9d', '#c44569', '#ffa07a', '#ffd700', '#ff69b4', '#ff1493'];
    
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 5 - 2.5
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillFalling = false;
      
      confetti.forEach(c => {
        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotationSpeed;
        
        if (c.y < canvas.height) {
          stillFalling = true;
        }
        
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation * Math.PI / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      });
      
      if (stillFalling) {
        requestAnimationFrame(animate);
      }
    }
    
    animate();
  }
  
  // Initialize progress bar
  updateProgress();
  
  // Add touch feedback for mobile
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('touchend', function() {
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
    });
  });
  
});