import ResultsPage from './components/results-page';
import aa from 'search-insights';

console.log('=== app.js loaded ===');
console.log('search-insights library:', aa);

// Initialize Algolia Insights
console.log('Initializing Insights with:', {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  index: process.env.ALGOLIA_INDEX
});

aa('init', {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  useCookie: true,
});

class SpencerAndWilliamsSearch {
  constructor() {
    console.log('Initializing SpencerAndWilliamsSearch');
    this._initSearch();
    
    // Wait a moment for DOM to render, then check if buttons exist
    setTimeout(() => {
      this._checkButtonsInDOM();
      this._registerInsightsEvents();
    }, 500);
  }

  _checkButtonsInDOM() {
    const buttons = document.querySelectorAll('[data-insights-event]');
    console.log('🔍 Buttons found in DOM:', buttons.length);
    buttons.forEach(btn => {
      console.log('  - Button:', btn.tagName, btn.className, btn.getAttribute('data-insights-event'), btn.textContent);
    });
  }

  _initSearch() {
    this.resultPage = new ResultsPage();
  }

  _registerInsightsEvents() {
    console.log('Registering Insights event listeners');
    
    // Simple approach: Listen on document with bubble phase (not capture)
    document.addEventListener('click', (event) => {
      const target = event.target;
      console.log('📍 Click target:', target.tagName, target.getAttribute('data-insights-event'));
      
      // If the target itself is a button with the attribute, use it
      if (target.tagName === 'BUTTON' && target.hasAttribute('data-insights-event')) {
        console.log('✅✅✅ DIRECT BUTTON CLICK:', target.getAttribute('data-insights-event'));
        this._handleInsightsEvent(target);
        return;
      }
      
      // Otherwise check parents up to 5 levels
      let el = target;
      for (let i = 0; i < 5; i++) {
        el = el.parentElement;
        if (!el) break;
        if (el.tagName === 'BUTTON' && el.hasAttribute('data-insights-event')) {
          console.log('✅✅✅ BUTTON FOUND IN PARENTS:', el.getAttribute('data-insights-event'));
          this._handleInsightsEvent(el);
          return;
        }
      }
    }, false); // Use bubble phase
  }

  _handleInsightsEvent(trackedElement) {
    const eventType = trackedElement.getAttribute('data-insights-event');
    const hitElement = trackedElement.closest('[data-objectid]');
    
    if (!hitElement) {
      console.warn('❌ No element with data-objectid found');
      return;
    }

    const objectID = hitElement.getAttribute('data-objectid');
    if (!objectID) {
      console.warn('❌ No objectID value found');
      return;
    }

    if (eventType === 'click') {
      aa('clickedObjectIDsAfterSearch', {
        objectIDs: [objectID],
      });
      console.log('✅ Click event sent for:', objectID);
    } else if (eventType === 'conversion') {
      aa('convertedObjectIDsAfterSearch', {
        objectIDs: [objectID],
      });
      console.log('✅ Conversion event sent for:', objectID);
    }
  }
}

const app = new SpencerAndWilliamsSearch();
