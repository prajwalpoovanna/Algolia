// ============================================
// ALGOLIA ASSIGNMENT - PART 1 SOLUTION
// ============================================
require('dotenv').config();

const { algoliasearch } = require('algoliasearch');
const fs = require('fs');
const path = require('path');

// 1. Load data
const products = JSON.parse(fs.readFileSync(
  path.join(__dirname, 'data', 'products.json'), 
  'utf8'
));

// 2. Your Algolia credentials

/* const APP_ID = process.env.ALGOLIA_APP_ID;
const ADMIN_API_KEY = process.env.ALGOLIA_API_KEY;
const INDEX_NAME = process.env.ALGOLIA_INDEX; */



const APP_ID = 'GCBIM11JSL';
const ADMIN_API_KEY = '0f3c275190df2efdfeca6d99449ec0c1';
const INDEX_NAME = 'assignment_solution'; 

// 3. Transform function
function transformProducts(products) {
  console.log('Transforming 10,000 products...\n');
  
  let cameraCount = 0;
  const transformed = [];
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // DEBUG: Show first 3 products
    if (i < 3) {
      console.log(`   Product ${i + 1}: ${product.name?.substring(0, 40) || 'No name'}...`);
      console.log(`        Categories: ${JSON.stringify(product.categories)}`);
    }
    
    // Check if it's a camera
    let isCamera = false;
    if (product.categories && Array.isArray(product.categories)) {
      for (const category of product.categories) {
        if (typeof category === 'string' && 
            category.toLowerCase().includes('camera')) {
          isCamera = true;
          break;
        }
      }
    }
    
    // DEBUG: Show if marked as camera
    if (i < 3) {
      console.log(`        Marked as camera? ${isCamera}\n`);
    }
    
    // Create the object for Algolia - ALL products get is_camera:false by default
    const obj = {
      objectID: `product_${i + 1}`,
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      categories: product.categories || [],
      price: product.price || 0,
      image: product.image || '',
      rating: product.rating || 0,
      is_camera: false,  // ← EVERY product starts as false
      on_sale: false     // ← EVERY product starts as false
    };
    
    // Apply 20% discount to cameras only
    if (isCamera && typeof product.price === 'number') {
      const discounted = product.price * 0.8;
      const rounded = Math.floor(discounted);
      
      obj.price = rounded;
      obj.original_price = product.price;
      obj.is_camera = true;      // ← Override to true for cameras
      obj.on_sale = true;        // ← Override to true for cameras
      obj.discount_percent = 20;
      
      cameraCount++;
      
      // DEBUG: Show first 3 cameras
      if (cameraCount <= 3) {
        console.log(`   ✅ Camera ${cameraCount}: ${product.name?.substring(0, 40) || 'No name'}...`);
        console.log(`        Price: $${product.price} → $${rounded}\n`);
      }
    }
    
    // DEBUG: Show what's being saved for first 3 products
    if (i < 3) {
      console.log(`   DEBUG SAVING: ${product.name?.substring(0, 30)}...`);
      console.log(`        is_camera: ${obj.is_camera}`);
      console.log(`        original_price: ${obj.original_price || 'NO FIELD'}`);
      console.log('');
    }
    
    transformed.push(obj);
  }
  
  console.log(`\n✅ Transformation complete:`);
  console.log(`   Total products: ${transformed.length}`);
  console.log(`   Cameras discounted: ${cameraCount}`);
  console.log(`   Non-cameras: ${transformed.length - cameraCount}`);
  
  return { transformed, cameraCount };
}

// 4. Upload function
async function uploadToAlgolia(transformedProducts) {
  console.log('\n📤 Uploading to Algolia...');
  
  const client = algoliasearch(APP_ID, ADMIN_API_KEY);
  
  try {
    // First delete the index to start fresh
    console.log('   Deleting old index...');
    try {
      await client.deleteIndex(INDEX_NAME);
    } catch (e) {
      // Index doesn't exist, that's fine
    }
    
    // Use replaceAllObjects which handles everything
    console.log('   Uploading with replaceAllObjects...');
    
    await client.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: transformedProducts
    });
    
    // Apply minimal settings needed for verification filters
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        attributesForFaceting: [
          'is_camera',
          'original_price',
          'brand',
          'categories',
          'price',
          'rating',
          'searchable(brand)'
        ]
      }
    });

    // Give Algolia time to apply settings before verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`\n✅ Upload complete! ${transformedProducts.length} products`);
    
    return client;
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
  }
}

// 5. Verify function
async function verifyUpload(client, expectedCameraCount) {
  console.log('\n🔍 Verifying upload...');
  
  try {
    // Wait longer for Algolia to fully process and index
    console.log('   Waiting 10 seconds for Algolia to fully index...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Get total count
    const allResults = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParameters: {
        query: '',
        hitsPerPage: 0
      }
    });
    
    console.log(`   Total in index: ${allResults.nbHits}`);
    
    // Get cameras using is_camera field
    const cameraResults = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParameters: {
        query: '',
        filters: 'is_camera:true',
        hitsPerPage: 0
      }
    });
    
    console.log(`   Cameras found (is_camera:true): ${cameraResults.nbHits}`);
    console.log(`   Expected cameras: ${expectedCameraCount}`);
    
    // Also check with original_price filter
    const cameraWithPrice = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParameters: {
        query: '',
        filters: 'is_camera:true AND original_price > 0',
        hitsPerPage: 0
      }
    });
    
    console.log(`   Cameras with original_price: ${cameraWithPrice.nbHits}`);
    
    // Check a sample camera
    if (cameraWithPrice.nbHits > 0) {
      const sample = await client.searchSingleIndex({
        indexName: INDEX_NAME,
        searchParameters: {
          query: '',
          filters: 'is_camera:true AND original_price > 0',
          hitsPerPage: 1
        }
      });
      
      if (sample.hits[0]) {
        const camera = sample.hits[0];
        console.log(`\n📸 Sample camera: ${camera.name?.substring(0, 50) || 'No name'}...`);
        console.log(`   Original price: $${camera.original_price}`);
        console.log(`   Sale price: $${camera.price}`);
        
        const expected = Math.floor(camera.original_price * 0.8);
        const correct = camera.price === expected;
        
        console.log(`   Expected (20% off): $${expected}`);
        console.log(`   Correct? ${correct ? '✅ YES' : '❌ NO'}`);
      }
    }
    
    // Test: Find a specific camera we know exists
    console.log('\n🔍 TEST: Looking for 360fly camera...');
    const testCamera = await client.searchSingleIndex({
      indexName: INDEX_NAME,
      searchParameters: {
        query: '360fly',
        hitsPerPage: 1
      }
    });
    
    if (testCamera.hits[0]) {
      const cam = testCamera.hits[0];
      console.log(`   Found: ${cam.name?.substring(0, 50)}...`);
      console.log(`   is_camera: ${cam.is_camera}`);
      console.log(`   original_price: ${cam.original_price || 'NO FIELD'}`);
      console.log(`   price: ${cam.price}`);
    }
    
    // Final check
    console.log('\n' + '='.repeat(50));
    if (allResults.nbHits === 10000 && cameraResults.nbHits === expectedCameraCount) {
      console.log('🎉 PART 1 COMPLETED SUCCESSFULLY!');
      console.log('\n✅ 10,000 products uploaded');
      console.log(`✅ ${expectedCameraCount} cameras discounted by 20%`);
      console.log('✅ Prices rounded down correctly');
    } else {
      console.log('⚠️  Issues detected:');
      console.log(`   Expected: 10,000 total, ${expectedCameraCount} cameras`);
      console.log(`   Got: ${allResults.nbHits} total, ${cameraResults.nbHits} cameras`);
      console.log('\n   Note: If filters show wrong counts, the index may need more time.');
      console.log('   You can verify manually in the Algolia Dashboard.');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

// 6. Main function
async function main() {
  console.log('='.repeat(50));
  console.log('ALGOLIA TECHNICAL ASSIGNMENT - PART 1');
  console.log('='.repeat(50));
  console.log('Task: Apply 20% discount to camera products');
  console.log('      Round down to nearest whole number\n');
  
  try {
    // Step 1: Transform
    const { transformed, cameraCount } = transformProducts(products);
    
    // Step 2: Upload
    const client = await uploadToAlgolia(transformed);
    
    // Step 3: Verify
    await verifyUpload(client, cameraCount);
    
    console.log('\n' + '='.repeat(50));
    console.log('Check your Algolia dashboard:');
    console.log('https://www.algolia.com/dashboard');
    console.log(`Look for index: ${INDEX_NAME}`);
    
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    console.log('\nCheck:');
    console.log('1. Internet connection');
    console.log('2. Algolia credentials');
    console.log('3. Algolia dashboard');
  }
}

// Run everything
main();