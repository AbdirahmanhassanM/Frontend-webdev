// UI utility functions

// Show a notification message
export function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Add animation class after a small delay
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Toggle element visibility
export function toggleElement(element, show) {
  if (show) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

// Create a loading spinner
export function createSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  return spinner;
}

// Show loading state
export function showLoading(container) {
  const spinner = createSpinner();
  container.appendChild(spinner);
  return spinner;
}

// Hide loading state
export function hideLoading(spinner) {
  if (spinner && spinner.parentNode) {
    spinner.parentNode.removeChild(spinner);
  }
}

// Animate score counter
export function animateScore(element, startValue, endValue, duration = 1000) {
  const startTime = performance.now();
  const difference = endValue - startValue;
  
  function updateScore(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const eased = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const currentValue = Math.round(startValue + (difference * eased));
    element.textContent = `${currentValue}%`;
    
    if (progress < 1) {
      requestAnimationFrame(updateScore);
    }
  }
  
  requestAnimationFrame(updateScore);
}

// Add shake animation to element
export function shakeElement(element) {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 500);
}

// Add pulse animation to element
export function pulseElement(element) {
  element.classList.add('pulse');
  setTimeout(() => {
    element.classList.remove('pulse');
  }, 500);
} 