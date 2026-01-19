import ResultsPage from './components/results-page';
import aa from 'search-insights';

// Initialize Algolia Insights
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
    document.addEventListener('click', function (event) {
      const target = event.target;
      if (target.matches('[data-insights-event]')) {
        const eventType = target.getAttribute('data-insights-event');
        const hitElement = target.closest('.result-hit');
        if (!hitElement) return;
        const objectID = hitElement.getAttribute('data-objectid');
        if (!objectID) return;
        if (eventType === 'click') {
          aa('clickedObjectIDsAfterSearch', {
            eventName: 'Product Clicked',
            index: process.env.ALGOLIA_INDEX,
            objectIDs: [objectID],
          });
        } else if (eventType === 'conversion') {
          aa('convertedObjectIDsAfterSearch', {
            eventName: 'Product Added to Cart',
            index: process.env.ALGOLIA_INDEX,
            objectIDs: [objectID],
          });
        }
      }
    });
  }
}

const app = new SpencerAndWilliamsSearch();
