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
    
    // Create the object for Algolia
    const obj = {
      objectID: `product_${i + 1}`,
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      categories: product.categories || [],
      price: product.price || 0,
      image: product.image || '',
      rating: product.rating || 0,
      popularity: product.popularity || 0,
      is_camera: false,
      on_sale: false
    };
    
    // Apply 20% discount to cameras only
    if (isCamera && typeof product.price === 'number') {
      const discounted = product.price * 0.8;
      const rounded = Math.floor(discounted);
      
      obj.price = rounded;
      obj.original_price = product.price;
      obj.is_camera = true;
      obj.on_sale = true;
      obj.discount_percent = 20;
      
      cameraCount++;
      
      // Show first few cameras as examples
      if (cameraCount <= 3) {
        console.log(`   ✅ Camera ${cameraCount}: ${product.name?.substring(0, 50) || 'No name'}...`);
        console.log(`        Original: $${product.price} → Sale: $${rounded}\n`);
      }
    }
    
    transformed.push(obj);
  }
  
  console.log(`✅ Transformation complete:`);
  console.log(`   Total products: ${transformed.length}`);
  console.log(`   Cameras with 20% discount: ${cameraCount}`);
  console.log(`   Non-camera products: ${transformed.length - cameraCount}`);
  
  return { transformed, cameraCount };
}

// 4. Upload function
async function uploadToAlgolia(transformedProducts) {
  console.log('\n📤 Uploading to Algolia...');
  
  const client = algoliasearch(APP_ID, ADMIN_API_KEY);
  
  try {
    // Delete old index to start fresh
    console.log('   Clearing old index...');
    try {
      await client.deleteIndex(INDEX_NAME);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {
      // Index doesn't exist, that's fine
    }
    
    // Upload all products
    console.log('   Uploading products...');
    
    await client.replaceAllObjects({
      indexName: INDEX_NAME,
      objects: transformedProducts
    });
    
    // Apply settings for faceting
    console.log('   Configuring index settings...');
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

    // Give Algolia time to apply settings
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`\n✅ Upload complete! ${transformedProducts.length} products indexed`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    throw error;
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
    await uploadToAlgolia(transformed);
    
    // Success!
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ 10,000 products uploaded');
    console.log(`✅ ${cameraCount} cameras discounted by 20%`);
    console.log('✅ Prices rounded down correctly');
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