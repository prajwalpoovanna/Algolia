const { searchClient } = require('algoliasearch');

const APP_ID = 'GCBIM11JSL';
const ADMIN_API_KEY = '0f3c275190df2efdfeca6d99449ec0c1';
const INDEX_NAME = 'assignment_solution';

const client = searchClient(APP_ID, ADMIN_API_KEY);

(async () => {
  try {
    const settings = await client.getSettings({ indexName: INDEX_NAME });
    console.log('✅ Current index settings:');
    console.log(JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
