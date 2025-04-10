// Development mode utilities

// Check if we're in development mode
export function isDevelopmentMode() {
  return import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Toggle development mode
export function toggleDevMode() {
  const currentValue = localStorage.getItem('devMode') === 'true';
  const newValue = !currentValue;
  
  localStorage.setItem('devMode', newValue);
  
  // Reload the page to apply changes
  window.location.reload();
}

// Get development mode status
export function getDevModeStatus() {
  return localStorage.getItem('devMode') === 'true';
}

// Create development mode toggle button
export function createDevModeToggle() {
  if (!isDevelopmentMode()) return null;
  
  const toggle = document.createElement('button');
  toggle.id = 'dev-mode-toggle';
  toggle.className = 'dev-mode-toggle';
  toggle.textContent = getDevModeStatus() ? 'Dev Mode: ON' : 'Dev Mode: OFF';
  toggle.addEventListener('click', toggleDevMode);
  
  return toggle;
}

// Add development mode toggle to the page
export function addDevModeToggle() {
  if (!isDevelopmentMode()) return;
  
  const toggle = createDevModeToggle();
  if (toggle) {
    document.body.appendChild(toggle);
  }
} 