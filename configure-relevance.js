const { searchClient } = require('algoliasearch');

// Hardcoding credentials to ensure script runs without environment issues.
const APP_ID = 'GCBIM11JSL';
const ADMIN_API_KEY = '0f3c275190df2efdfeca6d99449ec0c1';
const INDEX_NAME = 'assignment_solution';

// Correct v5 client initialization for Node.js (CommonJS)
const client = searchClient(APP_ID, ADMIN_API_KEY);

async function configureRelevance() {
  try {
    console.log('Configuring relevance settings for index:', INDEX_NAME);

    const indexSettings = {
      searchableAttributes: [
        'brand',
        'name',
        'categories',
        'description',
        'unordered(name)',
        'unordered(brand)',
      ],
      customRanking: ['desc(popularity)', 'desc(rating)'],
      attributesForFaceting: [
        'brand',
        'categories',
        'price',
        'rating',
        'searchable(brand)',
        // Added for verification and filtering
        'is_camera',
        'original_price',
      ],
    };

    // Call setSettings with both indexName and indexSettings in a single object
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: indexSettings,
    });
    
    console.log('✅ Relevance settings configured successfully.');
  } catch (error) {
    console.error('Error configuring relevance settings:', error);
  }
}

configureRelevance();
