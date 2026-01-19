import ResultsPage from './components/results-page';
import aa from 'search-insights';

// Initialize Algolia Insights for tracking user interactions
aa('init', {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  useCookie: true,
});

class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
    this._registerInsightsEvents();
  }
  _initSearch() {
    this.resultPage = new ResultsPage();
  }

  _registerInsightsEvents() {
    // Listen for button clicks on the document
    document.addEventListener('click', (event) => {
      const target = event.target;
      
      // If the target itself is a button with the attribute, use it
      if (target.tagName === 'BUTTON' && target.hasAttribute('data-insights-event')) {
        this._handleInsightsEvent(target);
        return;
      }
      
      // Otherwise check parents up to 5 levels
      let el = target;
      for (let i = 0; i < 5; i++) {
        el = el.parentElement;
        if (!el) break;
        if (el.tagName === 'BUTTON' && el.hasAttribute('data-insights-event')) {
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
