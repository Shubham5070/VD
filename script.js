// ============================================
// GOOGLE SHEETS DATABASE CONFIGURATION
// ============================================
// Follow setup instructions in SETUP.md file
// Replace this URL with your own Google Apps Script Web App URL
// ============================================
// DATABASE CONFIGURATION - SUPABASE (FREE & EASY!)
// ============================================
// Follow these steps to set up:
// 1. Go to https://supabase.com and create a free account
// 2. Create a new project
// 3. Go to Settings > API and copy your URL and anon key
// 4. Replace the values below
// 5. Set ENABLE_DATABASE to true
// 6. Create table using SQL in next comment block
// ============================================

const SUPABASE_URL = 'https://ghutjqujbsdlufthejpc.supabase.com'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodXRqcXVqYnNkbHVmdGhlanBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzgyMTUsImV4cCI6MjA4NjY1NDIxNX0.OU7oxnrnnCjHeJ1k-m3hjkjvFZl0177EMvs0ehaPbi0';
const ENABLE_DATABASE = true; // Set to true after setup

/* 
STEP 7: Run this SQL in Supabase SQL Editor to create the table:

CREATE TABLE responses (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  quiz_score INTEGER,
  calm_place TEXT,
  coffee_rule TEXT,
  vibe TEXT,
  bike_preference TEXT,
  food_mood TEXT,
  late_night TEXT,
  what_matters TEXT,
  serious_question TEXT,
  communication TEXT,
  vibe_check TEXT,
  final_answer TEXT,
  all_responses JSONB
);

-- Make table publicly insertable (read-only for you in dashboard)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON responses
  FOR INSERT TO anon
  WITH CHECK (true);
*/
// ============================================

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
  let hintsRemaining = 3;
  let questionTimer = null;
  let questionSeconds = 0;
  
  // 50 funny confusing quiz questions (without answers in options)
  const questionPool = [
    {
      q: "If you could only eat one color of food for the rest of your life, which color would keep you alive the longest?",
      options: ["Green", "Red", "Yellow", "Brown"],
      correct: 0,
      hint: "Think vegetables... or just pick your favorite color 😏"
    },
    {
      q: "A bat and a ball cost ₹110 in total. The bat costs ₹100 more than the ball. How much does the ball cost?",
      options: ["₹10", "₹5", "₹20", "₹15"],
      correct: 1,
      hint: "Math isn't your strong point, is it? 😂 Try again!"
    },
    {
      q: "If you're running a race and you pass the person in 2nd place, what place are you in now?",
      options: ["1st place", "2nd place", "3rd place", "Still running"],
      correct: 1,
      hint: "Think carefully... you PASSED the 2nd place person 🤔"
    },
    {
      q: "How many months have 28 days?",
      options: ["1", "2", "12", "Only February"],
      correct: 2,
      hint: "Every month has AT LEAST 28 days... get it? 😌"
    },
    {
      q: "Which is heavier: 1 kg of feathers or 1 kg of iron?",
      options: ["Feathers", "Iron", "Both same", "Depends"],
      correct: 2,
      hint: "1 kg = 1 kg... seriously? 🙄"
    },
    {
      q: "If a plane crashes exactly on the border of India and Pakistan, where do they bury the survivors?",
      options: ["India", "Pakistan", "Nepal", "Nowhere"],
      correct: 3,
      hint: "Read the question again... SURVIVORS 🤦"
    },
    {
      q: "What comes once in a minute, twice in a moment, but never in a thousand years?",
      options: ["Time", "Letter M", "Luck", "Happiness"],
      correct: 1,
      hint: "Count the letters in each word... M-I-N-U-T-E 😏"
    },
    {
      q: "If there are 3 apples and you take away 2, how many do YOU have?",
      options: ["1", "2", "3", "0"],
      correct: 1,
      hint: "YOU took 2 apples... so YOU have? 🍎"
    },
    {
      q: "A farmer has 17 sheep. All but 9 die. How many are left?",
      options: ["8", "9", "0", "17"],
      correct: 1,
      hint: "'All BUT 9' means 9 survived! 🐑"
    },
    {
      q: "What goes up but never comes down?",
      options: ["Balloon", "Age", "Airplane", "Temperature"],
      correct: 1,
      hint: "Think about birthdays... can you get younger? 🎂"
    },
    {
      q: "What can you hold without ever touching it?",
      options: ["Air", "Breath", "Conversation", "Grudge"],
      correct: 2,
      hint: "You can HOLD a conversation without touching it 💬"
    },
    {
      q: "If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?",
      options: ["100 min", "20 min", "5 min", "500 min"],
      correct: 2,
      hint: "Each machine makes 1 widget in 5 minutes... still confused? 😂"
    },
    {
      q: "What word becomes shorter when you add two letters to it?",
      options: ["Long", "Short", "Brief", "Tiny"],
      correct: 1,
      hint: "Add 'er' to SHORT = SHORTER 🤭"
    },
    {
      q: "If you overtake the last person in a race, what position are you in?",
      options: ["2nd last", "Last", "Can't do it", "1st"],
      correct: 2,
      hint: "How can you overtake the LAST person? Think! 🏃"
    },
    {
      q: "How many times can you subtract 10 from 100?",
      options: ["10 times", "Once", "Infinite", "9 times"],
      correct: 1,
      hint: "After first time, it's 90, not 100 anymore! 😏"
    },
    {
      q: "A rooster laid an egg on top of a roof. Which way did it roll?",
      options: ["Left", "Right", "Middle", "Didn't roll"],
      correct: 3,
      hint: "Roosters don't lay eggs, genius! 🐓"
    },
    {
      q: "What gets wetter the more it dries?",
      options: ["Sponge", "Towel", "Mop", "Hair"],
      correct: 1,
      hint: "What do you use after shower? 🛁"
    },
    {
      q: "In a dark room with candle, oil lamp, and fireplace but only one match, what lights first?",
      options: ["Candle", "Oil lamp", "Fireplace", "The match"],
      correct: 3,
      hint: "You need to light the match FIRST, duh! 🔥"
    },
    {
      q: "What has hands but can't clap?",
      options: ["Statue", "Clock", "Mannequin", "Robot"],
      correct: 1,
      hint: "Check the time... what has hands? ⏰"
    },
    {
      q: "If two's company and three's a crowd, what are four and five?",
      options: ["Party", "Too many", "Nine", "Chaos"],
      correct: 2,
      hint: "4 + 5 = ? Basic math! 😂"
    },
    {
      q: "What belongs to you but others use it more than you?",
      options: ["WiFi", "Name", "Netflix", "Advice"],
      correct: 1,
      hint: "People call you by your... 🤔"
    },
    {
      q: "Before Mt. Everest was discovered, what was the tallest mountain?",
      options: ["K2", "Kilimanjaro", "Still Everest", "None"],
      correct: 2,
      hint: "It was still the tallest, just not discovered! 🏔️"
    },
    {
      q: "What's full of holes but still holds water?",
      options: ["Bucket", "Sponge", "Net", "Straw"],
      correct: 1,
      hint: "Kitchen cleaning time... 🧽"
    },
    {
      q: "A girl fell off a 50-foot ladder but didn't get hurt. How?",
      options: ["Parachute", "Cushions", "Bottom step", "Superman"],
      correct: 2,
      hint: "She was on the first step! Not that high 😌"
    },
    {
      q: "What starts with 'e', ends with 'e', but only has one letter in it?",
      options: ["Eye", "Ear", "Envelope", "Eagle"],
      correct: 2,
      hint: "You put letters inside it... ✉️"
    },
    {
      q: "I have cities but no houses, forests but no trees, water but no fish. What am I?",
      options: ["Painting", "Map", "Video game", "Model"],
      correct: 1,
      hint: "Geography class... what shows cities? 🗺️"
    },
    {
      q: "What can travel around the world while staying in the corner?",
      options: ["Stamp", "Spider", "Email", "Wind"],
      correct: 0,
      hint: "Check the corner of an envelope... 📮"
    },
    {
      q: "If red house is red bricks, blue house is blue bricks, what is greenhouse made of?",
      options: ["Green bricks", "Glass", "Wood", "Plants"],
      correct: 1,
      hint: "Where do plants grow? Need sunlight! 🌱"
    },
    {
      q: "What has a neck but no head?",
      options: ["Giraffe", "Bottle", "T-shirt", "Vase"],
      correct: 1,
      hint: "Drink from it... 🍾"
    },
    {
      q: "How can you drop a raw egg on concrete without cracking it?",
      options: ["Bubble wrap", "1mm height", "Concrete won't crack", "Boil it"],
      correct: 2,
      hint: "Concrete is pretty hard to crack... 😏"
    },
    {
      q: "What goes through towns and hills but never moves?",
      options: ["River", "Road", "Train track", "Wind"],
      correct: 1,
      hint: "You drive on it... 🛣️"
    },
    {
      q: "What has 4 legs morning, 2 at noon, 3 evening?",
      options: ["Chair", "Human", "Dog", "Monster"],
      correct: 1,
      hint: "Baby crawls, adult walks, old person with cane 👴"
    },
    {
      q: "If you multiply all numbers on phone keypad, what do you get?",
      options: ["720", "0", "5040", "Error"],
      correct: 1,
      hint: "There's a zero on the keypad... 0 × anything = ? 📱"
    },
    {
      q: "What's orange and sounds like a parrot?",
      options: ["Orange", "Carrot", "Orange parrot", "Mango"],
      correct: 1,
      hint: "Carrot sounds like parrot... get it? 🥕"
    },
    {
      q: "A man pushes car to hotel and loses his fortune. What happened?",
      options: ["Broke down", "Playing Monopoly", "Gambling", "Expensive"],
      correct: 1,
      hint: "Board game with hotels... 🎲"
    },
    {
      q: "What 5-letter word becomes shorter when you add 2 letters?",
      options: ["Short", "Brief", "Small", "Quick"],
      correct: 0,
      hint: "SHORT + ER = SHORTER 😂"
    },
    {
      q: "If you have it, you want to share it. If you share it, you don't have it anymore.",
      options: ["Money", "Secret", "Food", "Password"],
      correct: 1,
      hint: "Once you tell everyone... 🤫"
    },
    {
      q: "What's black when buy, red when use, white when throw away?",
      options: ["Charcoal", "Pen", "Phone", "Tire"],
      correct: 0,
      hint: "Used for BBQ... 🔥"
    },
    {
      q: "Wednesday, Tom and Joe went to restaurant. Who paid?",
      options: ["Tom", "Joe", "Wednesday", "Split bill"],
      correct: 2,
      hint: "Wednesday is a person's name! 😂"
    },
    {
      q: "What can run but never walks, has mouth but never talks?",
      options: ["River", "Robot", "Clock", "Car"],
      correct: 0,
      hint: "Water flows... 💧"
    },
    {
      q: "What question can you never answer 'yes' to truthfully?",
      options: ["Are you dead?", "Are you asleep?", "Are you lying?", "Are you hungry?"],
      correct: 1,
      hint: "If you're answering, you're not... 😴"
    },
    {
      q: "If American in living room, what are you in bathroom?",
      options: ["European", "American", "Confused", "Private"],
      correct: 0,
      hint: "European = You're-a-peein' 😂"
    },
    {
      q: "What has keys but no locks, space but no room, enter but can't go inside?",
      options: ["Prison", "Keyboard", "Parking", "Door"],
      correct: 1,
      hint: "You're typing on one right now... ⌨️"
    },
    {
      q: "Why can't you give Elsa a balloon?",
      options: ["Fictional", "Let it go", "Too cold", "No hands"],
      correct: 1,
      hint: "Famous Frozen song... 🎵"
    },
    {
      q: "What do you call a bear with no teeth?",
      options: ["Toothless", "Gummy bear", "Dangerous", "Vegetarian"],
      correct: 1,
      hint: "It's also a candy... 🐻"
    },
    {
      q: "Why don't scientists trust atoms?",
      options: ["Too small", "Make up everything", "Unstable", "Negative"],
      correct: 1,
      hint: "They literally make up everything! 😏"
    },
    {
      q: "What's worse than finding a worm in your apple?",
      options: ["Two worms", "Half a worm", "No apple", "Spider"],
      correct: 1,
      hint: "Half means you already ate the other half... 🐛"
    },
    {
      q: "How do you organize a space party?",
      options: ["Call NASA", "You planet", "Rent venue", "Invite aliens"],
      correct: 1,
      hint: "You PLANET... get it? 🪐"
    },
    {
      q: "What's the best thing about Switzerland?",
      options: ["Chocolate", "Flag is a big plus", "Mountains", "Watches"],
      correct: 1,
      hint: "The flag is literally a big plus sign! ➕"
    },
    {
      q: "Why did the bicycle fall over?",
      options: ["Broken", "Too tired", "Wind", "Drunk rider"],
      correct: 1,
      hint: "It was two-tired... 🚲"
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
  
  // Chopper animation between sections
  function showChopperTransition(nextSectionText, callback) {
    const chopper = document.getElementById('chopperTransition');
    const text = document.getElementById('chopperText');
    
    text.textContent = nextSectionText;
    chopper.classList.add('active');
    
    // Play chopper sound
    playChopperSound();
    
    // Remove after animation completes
    setTimeout(() => {
      chopper.classList.remove('active');
      if (callback) callback();
    }, 2200);
  }
  
  // Play chopper helicopter sound
  function playChopperSound() {
    // Create audio context for helicopter sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillators for helicopter rotor sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure helicopter rotor sound
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.5);
    
    oscillator2.type = 'square';
    oscillator2.frequency.setValueAtTime(40, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.5);
    
    // Create rhythmic pulsing for rotor blades
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    for (let i = 0; i < 20; i++) {
      const time = audioContext.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(0.15, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    }
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 2);
    oscillator2.stop(audioContext.currentTime + 2);
  }
  
  // Show step with animation
  function showStep(stepId) {
    console.log('=== showStep called with:', stepId, '===');
    const allSteps = document.querySelectorAll(".step");
    
    // Check if transitioning between sections (show chopper)
    const currentActive = document.querySelector('.step.active');
    const currentId = currentActive ? currentActive.id : '';
    
    console.log('Transitioning from:', currentId, 'to:', stepId);
    
    let needsChopperTransition = false;
    let chopperText = '';
    
    // Define section transitions
    if (currentId === 'step-1' && stepId === 'section-1-intro') {
      needsChopperTransition = true;
      chopperText = 'Section 1: Getting to Know You 💫';
    } else if (currentId === 'step-5' && stepId === 'section-2-intro') {
      needsChopperTransition = true;
      chopperText = 'Section 2: The Confusion Quiz! 🧠';
    } else if (currentId === 'quiz-result' && stepId === 'section-3-intro') {
      needsChopperTransition = true;
      chopperText = 'Section 3: Game Time! 🎮';
    } else if (currentId === 'game-2' && stepId === 'step-9') {
      needsChopperTransition = true;
      chopperText = 'Final Questions 💕';
    }
    
    console.log('Needs chopper:', needsChopperTransition);
    
    if (needsChopperTransition) {
      // Fade out current step
      allSteps.forEach(s => {
        if (s.classList.contains('active')) {
          s.style.animation = 'slideOut 0.4s ease forwards';
          setTimeout(() => {
            s.classList.remove("active");
            s.style.animation = '';
          }, 400);
        }
      });
      
      // Show chopper, then show next step
      setTimeout(() => {
        showChopperTransition(chopperText, () => {
          const newStep = document.getElementById(stepId);
          if (newStep) {
            console.log('Activating step:', stepId);
            newStep.classList.add("active");
            initializeStep(stepId);
          } else {
            console.error('Step not found:', stepId);
          }
        });
      }, 450);
    } else {
      // Normal transition without chopper
      allSteps.forEach(s => {
        if (s.classList.contains('active')) {
          s.style.animation = 'slideOut 0.4s ease forwards';
          setTimeout(() => {
            s.classList.remove("active");
            s.style.animation = '';
          }, 400);
        }
      });
      
      setTimeout(() => {
        const newStep = document.getElementById(stepId);
        if (newStep) {
          console.log('Activating step:', stepId);
          newStep.classList.add("active");
          initializeStep(stepId);
        } else {
          console.error('Step not found:', stepId);
        }
      }, 450);
    }
  }
  
  // Initialize step (separated for reuse)
  function initializeStep(stepId) {
    updateProgress();
    
    // Initialize memory game if on that step
    if (stepId === 'game-2') {
      initMemoryGame();
    }
    
    // Display quiz question if on quiz step
    if (stepId === 'quiz-step') {
      displayQuizQuestion();
    }
    
    // Trigger heart animation on final step
    if (stepId === 'step-12') {
      setTimeout(generateFinalMessage, 500);
    }
  }
  
  function nextStep() {
    console.log('=== nextStep called ===');
    
    // Define the flow order
    const flowOrder = [
      'step-1',           // Name selection
      'section-1-intro',  // Section 1 intro
      'step-2',           // Calm place
      'step-3',           // Coffee rule
      'step-4',           // Vibe
      'step-4-5',         // Bike question
      'step-4-6',         // Food preference
      'step-4-7',         // Late night
      'step-5',           // What matters
      'section-2-intro',  // Quiz intro
      'quiz-step',        // Quiz questions
      'quiz-result',      // Quiz result
      'section-3-intro',  // Games intro
      'game-1',           // Reaction game
      'game-2',           // Memory match
      'step-9',           // Serious question
      'step-10',          // Communication
      'step-11',          // Vibe check final
      'step-12'           // Final message
    ];
    
    // Find current position in flow
    const currentActive = document.querySelector('.step.active');
    const currentId = currentActive ? currentActive.id : 'step-1';
    const currentIndex = flowOrder.indexOf(currentId);
    
    console.log('Current step:', currentId, 'Index:', currentIndex);
    
    if (currentIndex < flowOrder.length - 1) {
      const nextId = flowOrder[currentIndex + 1];
      console.log('Next step:', nextId);
      showStep(nextId);
    } else {
      console.log('No next step found!');
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
    // Pick 10 random questions from the pool
    quizQuestions = shuffleArray(questionPool).slice(0, 10);
    currentQuizIndex = 0;
    quizScore = 0;
    quizSeconds = 0;
    hintsRemaining = 3;
  }
  
  function displayQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
      showQuizResult();
      return;
    }
    
    const q = quizQuestions[currentQuizIndex];
    document.getElementById('currentQ').textContent = currentQuizIndex + 1;
    document.getElementById('quizQuestion').textContent = q.q;
    
    // Reset and start question timer (21 seconds)
    questionSeconds = 21;
    document.getElementById('questionTimer').textContent = questionSeconds;
    document.getElementById('questionTimer').style.color = 'var(--secondary)';
    
    if (questionTimer) clearInterval(questionTimer);
    questionTimer = setInterval(() => {
      questionSeconds--;
      document.getElementById('questionTimer').textContent = questionSeconds;
      
      // Change color when time running out
      if (questionSeconds <= 5) {
        document.getElementById('questionTimer').style.color = '#ff4444';
      }
      
      // Auto-move to next question when time runs out
      if (questionSeconds <= 0) {
        clearInterval(questionTimer);
        setTimeout(() => {
          currentQuizIndex++;
          displayQuizQuestion();
        }, 1000);
      }
    }, 1000);
    
    // Update hints display
    document.getElementById('hintsLeft').textContent = hintsRemaining;
    document.getElementById('hintBtn').disabled = hintsRemaining <= 0;
    document.getElementById('hintText').style.display = 'none';
    document.getElementById('hintText').textContent = '';
    
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
  
  function useHint() {
    if (hintsRemaining <= 0) return;
    
    hintsRemaining--;
    const q = quizQuestions[currentQuizIndex];
    
    document.getElementById('hintsLeft').textContent = hintsRemaining;
    document.getElementById('hintBtn').disabled = hintsRemaining <= 0;
    
    const hintText = document.getElementById('hintText');
    hintText.textContent = q.hint;
    hintText.style.display = 'block';
  }
  
  function selectQuizAnswer(selectedIndex) {
    // Stop timer
    if (questionTimer) clearInterval(questionTimer);
    
    const q = quizQuestions[currentQuizIndex];
    
    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
    });
    
    // Mark as selected and show if correct
    document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
      if (idx === selectedIndex) {
        btn.classList.add('selected');
        if (idx === q.correct) {
          btn.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(102, 187, 106, 0.3))';
          btn.style.borderColor = '#4caf50';
        } else {
          btn.style.background = 'linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(229, 115, 115, 0.3))';
          btn.style.borderColor = '#f44336';
        }
      }
      // Always show correct answer
      if (idx === q.correct) {
        btn.style.borderColor = '#4caf50';
        btn.style.fontWeight = '700';
      }
    });
    
    // Check if correct
    if (selectedIndex === q.correct) {
      quizScore++;
    }
    
    // Move to next question after delay
    setTimeout(() => {
      currentQuizIndex++;
      displayQuizQuestion();
    }, 1500);
  }
  
  function showQuizResult() {
    // Stop timers
    if (quizTimer) clearInterval(quizTimer);
    if (questionTimer) clearInterval(questionTimer);
    
    // Show ACTUAL score (no manipulation!)
    document.getElementById('finalScore').textContent = quizScore;
    
    let message = '';
    let emoji = '';
    
    if (quizScore <= 3) {
      message = `${quizScore}/10? Seriously? 😂<br>Koi nahi, looks se compensate kar lena!<br>Quiz mein weak ho but personality strong hai! 💕`;
      emoji = '🙈';
    } else if (quizScore <= 5) {
      message = `${quizScore}/10... Average! 😌<br>Expected थोड़ा better from that brain!<br>Par chalta hai, aur bhi qualities hain 😏`;
      emoji = '🤷‍♀️';
    } else if (quizScore <= 7) {
      message = `${quizScore}/10! Not bad at all! 😊<br>Decent score hai, respect! 👏<br>Dimaag bhi hai, dil bhi! 💕`;
      emoji = '🎉';
    } else {
      message = `Whoa! ${quizScore}/10! Amazing! 🔥<br>Dimaag toh ekdum sharp hai!<br>Impressed हूँ seriously! 💕<br>(Ab humble bhi raho thoda 😂)`;
      emoji = '🎊';
    }
    
    document.getElementById('resultMessage').innerHTML = message;
    document.getElementById('resultEmoji').textContent = emoji;
    
    showStep('quiz-result');
  }
  
  document.getElementById('hintBtn').addEventListener('click', useHint);
  
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
  
  // Send all responses to Google Sheets
  function saveResponsesToDatabase() {
    if (!ENABLE_DATABASE) {
      console.log('📊 Database disabled. Responses:', answers);
      console.log('Quiz Score:', quizScore);
      return;
    }
    
    // Check if Supabase is configured
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
      console.warn('⚠️ Supabase credentials not configured!');
      console.log('Responses:', answers);
      return;
    }
    
    // Prepare data to send to Supabase
    const data = {
      name: answers.name || 'Not provided',
      quiz_score: quizScore || 0,
      calm_place: answers.q2 || null,
      coffee_rule: answers.q3 || null,
      vibe: answers.q4 || null,
      bike_preference: answers['q4-5'] || null,
      food_mood: answers['q4-6'] || null,
      late_night: answers['q4-7'] || null,
      what_matters: answers.q5 || null,
      serious_question: answers.q9 || null,
      communication: answers.q10 || null,
      vibe_check: answers.q11 || null,
      final_answer: 'Yes',
      all_responses: answers
    };
    
    console.log('💾 Sending data to Supabase:', data);
    
    // Send to Supabase
    fetch(`${SUPABASE_URL}/rest/v1/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log('✅ Responses saved to Supabase!');
      } else {
        console.error('❌ Failed to save:', response.status);
      }
    })
    .catch(error => {
      console.error('❌ Error saving to database:', error);
    });
  }
  
  // YES button with confetti
  document.getElementById("yesBtn").addEventListener("click", function () {
    this.innerHTML = '<span>Yeahhh! Let\'s do this 🎉✨</span>';
    this.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
    this.style.color = 'white';
    this.style.transform = 'scale(1.05)';
    
    document.getElementById("noBtn").style.display = 'none';
    
    // Save responses to database
    saveResponsesToDatabase();
    
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
  
  // Reaction game (MOVED INSIDE DOMContentLoaded)
  let reactionStartTime = 0;
  let reactionTimeout = null;
  let reactionCompleted = false;
  let reactionInProgress = false;
  
  document.getElementById('reactionBtn').addEventListener('click', startReactionGame);
  
  const continueReactionBtn = document.getElementById('continueAfterReaction');
  if (continueReactionBtn) {
    continueReactionBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Continue button clicked!');
      console.log('typeof nextStep:', typeof nextStep);
      
      // Force clear any remaining box interactions
      const box = document.getElementById('reactionBox');
      if (box) {
        box.onclick = null;
        box.style.pointerEvents = 'none';
      }
      
      // Always proceed to next step
      console.log('Calling nextStep...');
      nextStep();
    });
  } else {
    console.error('Continue button not found!');
  }
  
  function startReactionGame() {
    const box = document.getElementById('reactionBox');
    const text = document.getElementById('reactionText');
    const btn = document.getElementById('reactionBtn');
    const result = document.getElementById('reactionResult');
    const continueBtn = document.getElementById('continueAfterReaction');
    
    btn.disabled = true;
    result.style.display = 'none';
    reactionInProgress = true;
    
    // Enable box interaction
    box.style.pointerEvents = 'auto';
    
    // Red phase - wait
    box.className = 'reaction-box';
    box.style.background = 'linear-gradient(135deg, #f44336, #e57373)';
    text.textContent = 'Wait for it...';
    
    let tooEarly = false;
    
    box.onclick = function() {
      if (reactionInProgress && !tooEarly) {
        // Clicked too early
        tooEarly = true;
        text.textContent = 'Too early! 😂 Try again!';
        btn.disabled = false;
        reactionInProgress = false;
        if (reactionTimeout) {
          clearTimeout(reactionTimeout);
          reactionTimeout = null;
        }
        // Disable box until restart
        box.style.pointerEvents = 'none';
      }
    };
    
    // Wait random time (2-5 seconds)
    const waitTime = Math.random() * 3000 + 2000;
    
    reactionTimeout = setTimeout(() => {
      if (!reactionInProgress) return; // Exit if user clicked too early
      
      // Green phase - GO!
      box.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
      text.textContent = 'CLICK NOW! ⚡';
      reactionStartTime = Date.now();
      
      box.onclick = function() {
        if (!reactionInProgress) return;
        
        const reactionTime = Date.now() - reactionStartTime;
        document.getElementById('reactionTime').textContent = reactionTime;
        
        let message = '';
        if (reactionTime < 200) {
          message = `${reactionTime}ms?! 🔥 Lightning fast!<br>Reflexes ekdum sharp hain! Impressive! 💪`;
        } else if (reactionTime < 300) {
          message = `${reactionTime}ms! Pretty good! 😊<br>Quick reflexes, nice! 👏`;
        } else if (reactionTime < 400) {
          message = `${reactionTime}ms... Not bad! 😌<br>Average speed, but you tried! 💕`;
        } else {
          message = `${reactionTime}ms?! 😂 Thoda slow ho!<br>Were you sleeping? 😴<br>Practice karo! 🎮`;
        }
        
        document.getElementById('reactionMessage').innerHTML = message;
        result.style.display = 'block';
        
        // Disable box interaction completely
        box.onclick = null;
        box.style.pointerEvents = 'none';
        box.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        text.textContent = 'Done! ✨';
        
        btn.textContent = 'Try Again?';
        btn.disabled = false;
        reactionInProgress = false;
        
        // Mark as completed and show continue button
        reactionCompleted = true;
        continueBtn.style.display = 'block';
        
        console.log('Game completed, continue button shown');
      };
    }, waitTime);
  }

});