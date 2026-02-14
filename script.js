document.addEventListener("DOMContentLoaded", function () {
  
  let currentStep = 1;
  let totalSteps = 12;
  let answers = {};
  
  // Memory game state
  let flippedCards = [];
  let matchedPairs = 0;
  let canFlip = true;
  let gameTimer = null;
  let gameSeconds = 0;
  let gameCompleted = false;
  
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
  
  // Name selection
  document.querySelectorAll('.name-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedName = this.getAttribute('data-name');
      answers.name = selectedName;
      
      // Add selected animation
      this.style.transform = 'scale(1.1)';
      this.style.background = 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(255, 160, 122, 0.3))';
      
      setTimeout(() => {
        nextStep();
      }, 400);
    });
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
    gameSeconds = 0;
    gameCompleted = false;
    
    // Reset and start timer
    document.getElementById('gameTimer').textContent = '0:00';
    if (gameTimer) clearInterval(gameTimer);
    
    gameTimer = setInterval(() => {
      if (!gameCompleted) {
        gameSeconds++;
        const minutes = Math.floor(gameSeconds / 60);
        const seconds = gameSeconds % 60;
        document.getElementById('gameTimer').textContent = 
          `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
    
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
    document.getElementById('shayariReward').style.display = 'none';
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
    // Stop timer
    gameCompleted = true;
    if (gameTimer) clearInterval(gameTimer);
    
    // Add celebration effect to game status
    const status = document.querySelector('.game-status');
    status.innerHTML = '🎉 Perfect! All matched! 🎉';
    status.style.animation = 'pulse 0.5s ease 3';
    
    // Show shayari reward with different messages based on time
    setTimeout(() => {
      const shayariReward = document.getElementById('shayariReward');
      const resultText = document.getElementById('gameResultText');
      const continueBtn = document.getElementById('continueAfterGame');
      
      let message = '';
      
      // Fast completion (under 20 seconds)
      if (gameSeconds < 20) {
        message = `"Dimaag toh pehle se sharp tha,<br>
                   Ab dil bhi jeet liya tune... 💕<br>
                   <span style="font-size: 16px; opacity: 0.8;">Woh bhi sirf ${gameSeconds} seconds mein! 🔥</span><br>
                   <span style="font-size: 14px; opacity: 0.8;">P.S. - Ab zara humble bhi raho thoda 😏</span>"`;
      }
      // Medium completion (20-40 seconds)
      else if (gameSeconds < 40) {
        message = `"Smart toh ho hi,<br>
                   Bas thoda time leti ho sochne mein 😄<br>
                   <span style="font-size: 16px; opacity: 0.8;">But ${gameSeconds} seconds is still impressive! 💕</span><br>
                   <span style="font-size: 14px; opacity: 0.8;">P.S. - Next time aur fast try karna 😌</span>"`;
      }
      // Slow completion (over 40 seconds)
      else {
        message = `"${gameSeconds} seconds? Really? 😂<br>
                   Koi nahi, dil jeetna zyada important hai na 💕<br>
                   <span style="font-size: 14px; opacity: 0.8;">Memory game mein thoda weak ho, par tumhara charm strong hai 😏</span><br>
                   <span style="font-size: 14px; opacity: 0.8;">P.S. - Practice karte rahna! 🎮</span>"`;
      }
      
      resultText.innerHTML = message;
      shayariReward.style.display = 'block';
      
      // Show continue button after delay to give time to read
      setTimeout(() => {
        continueBtn.style.display = 'block';
      }, 4000); // 4 seconds to read the shayari
      
    }, 800);
  }
  
  // Generate final personalized message
  function generateFinalMessage() {
    let name = answers.name || "Swapna";
    
    // Display name
    document.getElementById('displayName').textContent = name;
  }
  
  // YES button with confetti
  document.getElementById("yesBtn").addEventListener("click", function () {
    this.innerHTML = '<span>Yeahhh! Let\'s do this 🎉✨</span>';
    this.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
    this.style.color = 'white';
    this.style.transform = 'scale(1.05)';
    
    document.getElementById("noBtn").style.display = 'none';
    
    // Trigger confetti
    launchConfetti();
    
    // Add success message
    setTimeout(() => {
      const successMsg = document.createElement('p');
      successMsg.textContent = '💕 This is going to be amazing 💕';
      successMsg.style.cssText = `
        margin-top: 20px;
        font-size: 17px;
        color: var(--primary);
        font-weight: 600;
        animation: revealText 0.8s ease forwards;
      `;
      document.querySelector('.final-buttons').appendChild(successMsg);
    }, 1000);
  });
  
  // Continue button after memory game
  document.getElementById('continueAfterGame').addEventListener('click', function() {
    nextStep();
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