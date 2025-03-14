// Array generation
let array = [76, 45, 64, 73, 86];
let target = 45;
let frames = [];
let currentFrameIndex = 0;
let animationTimer;
let isPaused = false;
let startTime = 0;

// DOM Elements
const arrayContainer = document.getElementById('array-container');
const targetInput = document.getElementById('target-input');
const targetDisplay = document.getElementById('target-value-display');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const thoughtBubble = document.getElementById('thought-bubble');
const currentFrameDisplay = document.getElementById('current-frame');
const totalFramesDisplay = document.getElementById('total-frames');
const progressBar = document.getElementById('progress-bar');
const resultMessage = document.getElementById('result-message');
const complexityInfo = document.getElementById('complexity-info');
const algorithmSteps = document.getElementById('algorithm-steps').getElementsByTagName('li');
const timeCounter = document.getElementById('time-counter');

// Initialize
function init() {
  targetInput.value = target;
  targetDisplay.textContent = target;
  renderArray();
  generateFrames();
  updateFrameDisplay();
  initEventListeners();
}

// Event Listeners
function initEventListeners() {
  generateBtn.addEventListener('click', generateRandomArray);
  startBtn.addEventListener('click', startAnimation);
  prevBtn.addEventListener('click', showPreviousFrame);
  nextBtn.addEventListener('click', showNextFrame);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', resetAnimation);
  targetInput.addEventListener('change', function() {
    target = parseInt(targetInput.value) || 5;
    targetDisplay.textContent = target;
    generateFrames();
    updateFrameDisplay();
  });
}

// Render array elements
function renderArray() {
  arrayContainer.innerHTML = '';
  array.forEach((value, index) => {
    const element = document.createElement('div');
    element.className = 'array-element';
    element.textContent = value;
    element.setAttribute('data-index', index);
    arrayContainer.appendChild(element);
  });
  // Force reflow to ensure elements are rendered
  arrayContainer.style.display = 'none';
  arrayContainer.offsetHeight; // Trigger reflow
  arrayContainer.style.display = '';
}

// Generate a random array of numbers
function generateRandomArray() {
  array = [];
  const size = 5;
  for (let i = 0; i < size; i++) {
    array.push(10 + Math.floor(Math.random() * 90));
  }
  if (Math.random() > 0.3) {
    const targetIndex = Math.floor(Math.random() * array.length);
    array[targetIndex] = target;
  }
  renderArray();
  generateFrames();
  updateFrameDisplay();
}

// Generate all frames for the stop motion animation
function generateFrames() {
  frames = [];
  frames.push({
    arrayState: array.map((value, index) => ({ value, index, state: 'normal' })),
    characterPosition: 0,
    thoughtText: "Let's start searching from the first element!",
    currentStep: 0
  });
  for (let i = 0; i < array.length; i++) {
    frames.push({
      arrayState: array.map((value, index) => ({ 
        value, index,
        state: index < i ? 'checked' : index === i ? 'current' : 'normal'
      })),
      characterPosition: i,
      thoughtText: `Is ${array[i]} equal to our target ${target}?`,
      currentStep: 1
    });
    if (array[i] === target) {
      frames.push({
        arrayState: array.map((value, index) => ({ 
          value, index,
          state: index < i ? 'checked' : index === i ? 'matched' : 'normal'
        })),
        characterPosition: i,
        thoughtText: `Match found at index ${i}! 🎉`,
        currentStep: 2,
        result: 'success'
      });
      break;
    } else if (i < array.length - 1) {
      frames.push({
        arrayState: array.map((value, index) => ({ 
          value, index,
          state: index <= i ? 'checked' : 'normal'
        })),
        characterPosition: i,
        thoughtText: `${array[i]} is not equal to ${target}. Let's move to the next element.`,
        currentStep: 3
      });
    } else {
      frames.push({
        arrayState: array.map((value, index) => ({ value, index, state: 'checked' })),
        characterPosition: i,
        thoughtText: `${array[i]} is not what we're looking for. No match found.`,
        currentStep: 5,
        result: 'failure'
      });
    }
  }
  currentFrameIndex = 0;
  totalFramesDisplay.textContent = frames.length;
}

// Update the display for the current frame
function updateFrameDisplay() {
  if (frames.length === 0 || currentFrameIndex >= frames.length) return;
  const frame = frames[currentFrameIndex];
  currentFrameDisplay.textContent = currentFrameIndex + 1;
  progressBar.style.width = `${((currentFrameIndex + 1) / frames.length) * 100}%`;
  arrayContainer.innerHTML = '';
  frame.arrayState.forEach(item => {
    const element = document.createElement('div');
    element.className = `array-element ${item.state}`;
    element.textContent = item.value;
    element.setAttribute('data-index', item.index);
    arrayContainer.appendChild(element);
  });
  
  thoughtBubble.textContent = frame.thoughtText;
  for (let i = 0; i < algorithmSteps.length; i++) {
    algorithmSteps[i].classList.remove('current-step');
  }
  if (frame.currentStep < algorithmSteps.length) {
    algorithmSteps[frame.currentStep].classList.add('current-step');
  }
  if (frame.result) {
    resultMessage.textContent = frame.result === 'success' 
      ? `Success! Found target ${target} at index ${frame.characterPosition}.`
      : `Target ${target} was not found in the array.`;
    resultMessage.className = `result-message ${frame.result}`;
    resultMessage.style.opacity = '1';
    
    // Show time complexity information
    showTimeComplexityInfo(frame.characterPosition, frame.result === 'success');
  } else {
    resultMessage.style.opacity = '0';
    complexityInfo.style.opacity = '0';
  }
  prevBtn.disabled = currentFrameIndex === 0;
  nextBtn.disabled = currentFrameIndex === frames.length - 1;
  // Update time counter
  if (currentFrameIndex === 0) startTime = Date.now();
  const elapsed = (Date.now() - startTime) / 1000;
  timeCounter.textContent = elapsed.toFixed(1) + 's';
}

// Function to show time complexity information
function showTimeComplexityInfo(position, isSuccess) {
  const arrayLength = array.length;
  let complexityText = '';
  
  if (!isSuccess) {
    // Not found case (worst case)
    complexityText = `Time Complexity: O(n) - Worst case - Checked all ${arrayLength} elements`;
  } else if (position === 0) {
    // Best case - found at first position
    complexityText = `Time Complexity: O(1) - Best case - Found at first element!`;
  } else if (position < arrayLength / 2) {
    // Better than average
    complexityText = `Time Complexity: O(${position+1}) - Better than average - Found before the middle`;
  } else if (position === Math.floor(arrayLength / 2)) {
    // Average case - found in the middle
    complexityText = `Time Complexity: O(n/2) - Average case - Found at the middle`;
  } else {
    // Worse than average, found after middle
    complexityText = `Time Complexity: O(${position+1}) - Worse than average - Found after the middle`;
  }
  
  complexityInfo.textContent = complexityText;
  complexityInfo.style.opacity = '1';
}

// Navigation functions
function showPreviousFrame() {
  if (currentFrameIndex > 0) {
    currentFrameIndex--;
    updateFrameDisplay();
  }
}

function showNextFrame() {
  if (currentFrameIndex < frames.length - 1) {
    currentFrameIndex++;
    updateFrameDisplay();
  } else {
    stopAnimation();
  }
}

// Animation control
function startAnimation() {
  resetAnimation();
  enableControls(false);
  pauseBtn.disabled = false;
  if (animationTimer) clearInterval(animationTimer);
  startTime = Date.now();
  animationTimer = setInterval(function() {
    if (!isPaused && currentFrameIndex < frames.length - 1) {
      currentFrameIndex++;
      updateFrameDisplay();
    } else {
      stopAnimation();
    }
  }, 1200); // Slightly faster animation for better fit in the 9:16 ratio
}

function stopAnimation() {
  if (animationTimer) clearInterval(animationTimer);
  enableControls(true);
  pauseBtn.disabled = true;
  isPaused = false;
  pauseBtn.textContent = "Pause";
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
}

function resetAnimation() {
  stopAnimation();
  currentFrameIndex = 0;
  startTime = 0;
  timeCounter.textContent = '0.0s';
  updateFrameDisplay();
  resultMessage.style.opacity = '0';
  complexityInfo.style.opacity = '0';
}

function enableControls(enabled) {
  startBtn.disabled = !enabled;
  generateBtn.disabled = !enabled;
  prevBtn.disabled = !enabled || currentFrameIndex === 0;
  nextBtn.disabled = !enabled || currentFrameIndex === frames.length - 1;
}

// Initialize on page load
window.addEventListener('load', init);