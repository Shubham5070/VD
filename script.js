document.addEventListener("DOMContentLoaded", function () {
  
  let currentStep = 1;
  let totalSteps = 20; // Will be updated dynamically
  let answers = {};
  
  // Memory game state
  let flippedCards = [];
  let matchedPairs = 0;
  let canFlip = true;
  let gameTimer = null;
  let gameSeconds = 0;
  let gameCompleted = false;
  
  // Quiz state
  let quizQuestions = [];
  let currentQuizIndex = 0;
  let quizScore = 0;
  let quizTimer = null;
  let quizSeconds = 0;
  
  // 50 funny confusing quiz questions
  const questionPool = [
    {
      q: "If you could only eat one color of food for the rest of your life, which color would keep you alive the longest?",
      options: ["Green (vegetables)", "Red (meat & tomatoes)", "Yellow (bananas & cheese)", "Brown (chocolate, obviously)"],
      correct: 0
    },
    {
      q: "A bat and a ball cost ₹110. The bat costs ₹100 more than the ball. How much does the ball cost?",
      options: ["₹10", "₹5", "₹20", "₹15"],
      correct: 1
    },
    {
      q: "If you're running a race and you pass the person in 2nd place, what place are you in?",
      options: ["1st place", "2nd place", "3rd place", "Still last 😂"],
      correct: 1
    },
    {
      q: "How many months have 28 days?",
      options: ["1 month", "2 months", "All 12 months", "Only February"],
      correct: 2
    },
    {
      q: "Which is heavier: 1 kg of feathers or 1 kg of iron?",
      options: ["Feathers", "Iron", "Both same", "Depends on mood"],
      correct: 2
    },
    {
      q: "If a plane crashes on the border of India and Pakistan, where do they bury the survivors?",
      options: ["India", "Pakistan", "Nepal", "You don't bury survivors! 🤦"],
      correct: 3
    },
    {
      q: "What comes once in a minute, twice in a moment, but never in a thousand years?",
      options: ["Time", "The letter M", "Luck", "Happiness"],
      correct: 1
    },
    {
      q: "If there are 3 apples and you take away 2, how many do YOU have?",
      options: ["1 apple", "2 apples", "3 apples", "0 apples"],
      correct: 1
    },
    {
      q: "A farmer has 17 sheep. All but 9 die. How many are left?",
      options: ["8 sheep", "9 sheep", "0 sheep", "17 sheep"],
      correct: 1
    },
    {
      q: "What goes up but never comes down?",
      options: ["Balloon", "Your age", "Airplane", "Temperature"],
      correct: 1
    },
    {
      q: "If you have a bowl with 6 apples and you take away 4, how many do you have?",
      options: ["2", "4", "6", "A weird obsession with apples"],
      correct: 1
    },
    {
      q: "What can you hold without touching it?",
      options: ["Air", "Your breath", "A conversation", "Your temper 😤"],
      correct: 2
    },
    {
      q: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
      options: ["100 minutes", "20 minutes", "5 minutes", "500 minutes"],
      correct: 2
    },
    {
      q: "What word becomes shorter when you add two letters to it?",
      options: ["Long", "Short", "Brief", "Tiny"],
      correct: 1
    },
    {
      q: "If you overtake the last person in a race, what position are you in?",
      options: ["2nd last", "Last", "Impossible! Can't overtake last", "1st place"],
      correct: 2
    },
    {
      q: "How many times can you subtract 10 from 100?",
      options: ["10 times", "Once (then it's 90)", "Infinite", "9 times"],
      correct: 1
    },
    {
      q: "A rooster laid an egg on top of a roof. Which way did it roll?",
      options: ["Left", "Right", "Down the middle", "Roosters don't lay eggs! 🐓"],
      correct: 3
    },
    {
      q: "What gets wetter the more it dries?",
      options: ["Sponge", "Towel", "Mop", "Your phone in rain"],
      correct: 1
    },
    {
      q: "If you're in a dark room with a candle, oil lamp, and fireplace but only one match, what do you light first?",
      options: ["Candle", "Oil lamp", "Fireplace", "The match, duh! 🔥"],
      correct: 3
    },
    {
      q: "What has hands but can't clap?",
      options: ["Statue", "Clock", "Mannequin", "My friend after workout"],
      correct: 1
    },
    {
      q: "If two's company and three's a crowd, what are four and five?",
      options: ["A party", "Too many", "Nine", "Chaos"],
      correct: 2
    },
    {
      q: "What belongs to you but others use it more than you?",
      options: ["Your WiFi password", "Your name", "Your Netflix account", "Your advice"],
      correct: 1
    },
    {
      q: "Before Mt. Everest was discovered, what was the tallest mountain?",
      options: ["K2", "Mt. Kilimanjaro", "Mt. Everest (still tallest)", "Your ego? 😏"],
      correct: 2
    },
    {
      q: "What's full of holes but still holds water?",
      options: ["Bucket", "Sponge", "Net", "My excuses"],
      correct: 1
    },
    {
      q: "A girl fell off a 50-foot ladder but didn't get hurt. How?",
      options: ["She had a parachute", "Landed on cushions", "She fell off the bottom step", "She's superhuman"],
      correct: 2
    },
    {
      q: "What starts with 'e', ends with 'e', but only has one letter in it?",
      options: ["Eye", "Ear", "Envelope", "Eagle"],
      correct: 2
    },
    {
      q: "I have cities but no houses, forests but no trees, water but no fish. What am I?",
      options: ["A painting", "A map", "A video game", "Dubai 😂"],
      correct: 1
    },
    {
      q: "What can travel around the world while staying in the corner?",
      options: ["A stamp", "A spider", "Your thoughts", "Internet cables"],
      correct: 0
    },
    {
      q: "If a red house is made of red bricks, and a blue house is made of blue bricks, what is a greenhouse made of?",
      options: ["Green bricks", "Glass", "Wood", "Plants"],
      correct: 1
    },
    {
      q: "What has a neck but no head?",
      options: ["Giraffe without head (scary)", "Bottle", "T-shirt", "Ostrich hiding"],
      correct: 1
    },
    {
      q: "How can you drop a raw egg on concrete without cracking it?",
      options: ["Wrap in bubble wrap", "Drop from 1mm height", "Concrete doesn't crack easily 😏", "Boil it first"],
      correct: 2
    },
    {
      q: "What goes through towns and hills but never moves?",
      options: ["River", "Road", "Train tracks", "Google Street View car"],
      correct: 1
    },
    {
      q: "What has 4 legs in the morning, 2 at noon, and 3 in the evening?",
      options: ["A chair", "Human (baby→adult→old with cane)", "A dog learning tricks", "Furniture sale"],
      correct: 1
    },
    {
      q: "If you multiply all numbers on a phone keypad, what do you get?",
      options: ["720", "0 (because of zero)", "5040", "Error 404"],
      correct: 1
    },
    {
      q: "What's orange and sounds like a parrot?",
      options: ["Orange", "A carrot", "Orange parrot", "Mango (close enough)"],
      correct: 1
    },
    {
      q: "A man pushes his car to a hotel and loses his fortune. What happened?",
      options: ["Car broke down", "Playing Monopoly 🎲", "Gambling addiction", "Hotel was expensive"],
      correct: 1
    },
    {
      q: "What 5-letter word becomes shorter when you add 2 letters to it?",
      options: ["Short", "Brief", "Small", "Quick"],
      correct: 0
    },
    {
      q: "If you have it, you want to share it. If you share it, you don't have it. What is it?",
      options: ["Money", "A secret", "Food", "WiFi password"],
      correct: 1
    },
    {
      q: "What's black when you buy it, red when you use it, and white when you throw it away?",
      options: ["Charcoal", "Pen", "Phone", "Relationship status 😂"],
      correct: 0
    },
    {
      q: "Wednesday, Tom and Joe went to a restaurant. They ate lunch. Who paid?",
      options: ["Tom", "Joe", "Wednesday (that's the name!)", "Split the bill"],
      correct: 2
    },
    {
      q: "What can run but never walks, has a mouth but never talks?",
      options: ["River", "Robot", "News anchor (maybe)", "My friend when late"],
      correct: 0
    },
    {
      q: "What question can you never answer 'yes' to truthfully?",
      options: ["Are you dead?", "Are you asleep?", "Are you lying?", "Do you like pineapple on pizza?"],
      correct: 1
    },
    {
      q: "If you're American in the living room, what are you in the bathroom?",
      options: ["European (you're-a-peein')", "Still American", "Confused", "On the phone"],
      correct: 0
    },
    {
      q: "What has keys but no locks, space but no room, you can enter but can't go inside?",
      options: ["Prison", "Keyboard ⌨️", "Parking lot", "Relationship (complicated)"],
      correct: 1
    },
    {
      q: "Why can't you give Elsa a balloon?",
      options: ["She's fictional", "She'll let it go 🎵", "Too cold", "No hands"],
      correct: 1
    },
    {
      q: "What's the laziest mountain in the world?",
      options: ["Mt. Everest (just sits there)", "Mt. Rushmore", "Everest (never moved)", "Mount Neverest 😴"],
      correct: 3
    },
    {
      q: "What do you call a bear with no teeth?",
      options: ["Toothless bear", "A gummy bear 🐻", "Dangerous anyway", "Vegetarian bear"],
      correct: 1
    },
    {
      q: "Why don't scientists trust atoms?",
      options: ["Too small", "They make up everything 😏", "Unstable", "They're negative"],
      correct: 1
    },
    {
      q: "What's worse than finding a worm in your apple?",
      options: ["Two worms", "Finding half a worm 🐛", "No apple", "Finding your ex"],
      correct: 1
    },
    {
      q: "How do you organize a space party?",
      options: ["Call NASA", "You planet 🪐", "Rent a venue", "Invite aliens"],
      correct: 1
    }
  ];
  
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  // Update progress bar
  function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
  }
  
  // Show step with animation
  function showStep(stepId) {
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
      let newStep;
      if (typeof stepId === 'string') {
        newStep = document.getElementById(stepId);
      } else {
        newStep = document.getElementById("step-" + stepId);
        currentStep = stepId;
      }
      
      if (newStep) {
        newStep.classList.add("active");
        updateProgress();
        
        // Initialize memory game if on that step
        if (stepId === 8 || stepId === 'step-8') {
          initMemoryGame();
        }
        
        // Display quiz question if on quiz step
        if (stepId === 'quiz-step') {
          displayQuizQuestion();
        }
        
        // Trigger heart animation on final step
        if (stepId === 12 || stepId === 'step-12') {
          setTimeout(generateFinalMessage, 500);
        }
      }
    }, 450);
  }
  
  function nextStep() {
    // Define the flow order
    const flowOrder = [
      'step-1',           // Name selection
      'section-1-intro',  // Section 1 intro
      'step-2',           // Calm place
      'step-3',           // Coffee rule
      'step-4',           // Vibe
      'step-5',           // What matters
      'section-2-intro',  // Quiz intro
      'quiz-step',        // Quiz questions
      'quiz-result',      // Quiz result (handled by quiz logic)
      'section-3-intro',  // Games intro
      'step-6',           // Would you rather
      'step-7',           // Teasing game
      'step-8',           // Memory game
      'step-9',           // Serious question
      'step-10',          // Communication
      'step-11',          // Vibe check final
      'step-12'           // Final message
    ];
    
    // Find current position in flow
    const currentActive = document.querySelector('.step.active');
    const currentId = currentActive ? currentActive.id : 'step-1';
    const currentIndex = flowOrder.indexOf(currentId);
    
    if (currentIndex < flowOrder.length - 1) {
      const nextId = flowOrder[currentIndex + 1];
      showStep(nextId);
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
  
  // Section intro buttons
  document.getElementById('startSection1').addEventListener('click', () => nextStep());
  
  document.getElementById('startQuiz').addEventListener('click', () => {
    initQuiz();
    nextStep();
  });
  
  document.getElementById('continueAfterQuiz').addEventListener('click', () => nextStep());
  
  document.getElementById('startGames').addEventListener('click', () => nextStep());
  
  // Quiz functions
  function initQuiz() {
    // Pick 20 random questions from the pool
    quizQuestions = shuffleArray(questionPool).slice(0, 20);
    currentQuizIndex = 0;
    quizScore = 0;
    quizSeconds = 0;
    
    // Start timer
    if (quizTimer) clearInterval(quizTimer);
    quizTimer = setInterval(() => {
      quizSeconds++;
      const minutes = Math.floor(quizSeconds / 60);
      const seconds = quizSeconds % 60;
      document.getElementById('quizTimer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }
  
  function displayQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
      showQuizResult();
      return;
    }
    
    const q = quizQuestions[currentQuizIndex];
    document.getElementById('currentQ').textContent = currentQuizIndex + 1;
    document.getElementById('quizQuestion').textContent = q.q;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = option;
      btn.addEventListener('click', () => selectQuizAnswer(index));
      optionsContainer.appendChild(btn);
    });
  }
  
  function selectQuizAnswer(selectedIndex) {
    const q = quizQuestions[currentQuizIndex];
    
    // Mark as selected
    document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
      if (idx === selectedIndex) {
        btn.classList.add('selected');
      }
    });
    
    // Check if correct (but we'll manipulate score later)
    if (selectedIndex === q.correct) {
      quizScore++;
    }
    
    // Move to next question after delay
    setTimeout(() => {
      currentQuizIndex++;
      displayQuizQuestion();
    }, 600);
  }
  
  function showQuizResult() {
    // Stop timer
    if (quizTimer) clearInterval(quizTimer);
    
    // Always show score between 5-10 (to tease her 😏)
    const displayScore = Math.floor(Math.random() * 6) + 5; // Random between 5-10
    
    document.getElementById('finalScore').textContent = displayScore;
    
    let message = '';
    let emoji = '';
    
    if (displayScore <= 6) {
      message = `${displayScore}/20? 😂<br>Koi nahi, dil toh jeet liya tune!<br>Quiz mein thoda weak ho, but personality strong hai! 💕`;
      emoji = '🙈';
    } else if (displayScore <= 8) {
      message = `${displayScore}/20... Not bad! 😌<br>Expected थोड़ा better, but chalta hai!<br>Looks se compensate kar lena 😏`;
      emoji = '🤷‍♀️';
    } else {
      message = `Whoa! ${displayScore}/20! 🎉<br>Dimaag bhi hai aur dil bhi!<br>Perfect combination 💕<br>(Still gonna tease you though 😂)`;
      emoji = '🎊';
    }
    
    document.getElementById('resultMessage').innerHTML = message;
    document.getElementById('resultEmoji').textContent = emoji;
    
    showStep('quiz-result');
  }
  
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