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
    document.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-track-event]');
      if (btn) {
        this._handleInsightsEvent(btn);
      }
    }, false);
  }

  _handleInsightsEvent(trackedElement) {
    const eventType = trackedElement.getAttribute('data-track-event');
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
      aa('clickedObjectIDs', {
        eventName: 'Product Clicked',
        index: process.env.ALGOLIA_INDEX,
        objectIDs: [objectID],
      });
      console.log('✅ Click event sent for:', objectID);
    } else if (eventType === 'conversion') {
      aa('convertedObjectIDs', {
        eventName: 'Product Added to Cart',
        index: process.env.ALGOLIA_INDEX,
        objectIDs: [objectID],
      });
      console.log('✅ Conversion event sent for:', objectID);
    }
  }
}

const app = new SpencerAndWilliamsSearch();
