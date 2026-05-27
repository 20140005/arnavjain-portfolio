// Vercel Speed Insights initialization for static HTML pages
import { injectSpeedInsights } from './speed-insights-bundle.js';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => injectSpeedInsights());
} else {
  injectSpeedInsights();
}
