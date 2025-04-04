import { createApp } from 'vue'
import App from './App.vue'

// Remove the noscript message if JavaScript is enabled
document.addEventListener('DOMContentLoaded', () => {
  const noscript = document.querySelector('noscript');
  if (noscript) {
    noscript.style.display = 'none';
  }
});

// Error handling to help diagnose production issues
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
});

const app = createApp(App);

// Configure Vue app
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err);
  console.error('Error info:', info);
};

// Mount the app
app.mount('#app'); 