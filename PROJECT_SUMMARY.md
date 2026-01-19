# Algolia Customer Solutions Assignment - COMPLETE ✅

## Project Summary
This is the completed assignment for Spencer & Williams e-commerce platform enhancement using Algolia search and Insights tracking.

## Deliverables

### Part 1: Data Transformation ✅
**File:** `solution.js`
- Reads 10,000 products from `data/products.json`
- Applies 20% discount to all products in the "Cameras" category
- Uploads transformed data to Algolia index: `assignment_solution`
- Command: `node solution.js`

### Part 2: Algolia Insights Tracking ✅
**Files:** `src/app.js`, `src/templates/result-hit.js`, `src/app.css`
- Implements click tracking on "View" buttons (`clickedObjectIDsAfterSearch`)
- Implements conversion tracking on "Add To Cart" buttons (`convertedObjectIDsAfterSearch`)
- Events are sent to Algolia and visible in the Events Debugger
- Evidence: Dashboard shows events being received successfully

### Part 3: Index Relevance Configuration ✅
**File:** `configure-relevance.js`
- Sets searchable attributes: brand, name, categories, description
- Sets custom ranking by popularity and rating
- Configures faceting for brand, categories, price, rating
- Command: `node configure-relevance.js`

### Part 4: Customer Support Questions ✅
**File:** `questions/questions.md`
- Answers 3 example customer support questions
- Professional, friendly tone
- Clear and concise responses

## Technology Stack
- **Frontend:** HTML, CSS, JavaScript (ES6+)
- **Search:** InstantSearch.js v4 + Algolia API
- **Analytics:** search-insights library
- **Bundler:** Parcel
- **Backend Scripts:** Node.js

## File Structure
```
algolia-assignment/
├── solution.js              # Part 1: Data transformation
├── configure-relevance.js   # Part 3: Relevance settings
├── data/products.json       # Product dataset
├── algolia-customer-solutions-assignment-main/
│   ├── src/
│   │   ├── app.js          # Part 2: Insights tracking
│   │   ├── app.css         # Styling (pointer-events fix)
│   │   ├── components/     # InstantSearch components
│   │   └── templates/      # HTML templates
│   ├── questions/
│   │   └── questions.md    # Part 4: Customer Q&A
│   └── index.html          # Main page
└── .gitignore              # Git configuration
```

## How to Run

### Development
```bash
cd algolia-customer-solutions-assignment-main
npm install
npm start
# Open http://localhost:3000
```

### Data Upload
```bash
node solution.js
```

### Configure Index Settings
```bash
node configure-relevance.js
```

## Key Features
- ✅ Full text search with faceted navigation
- ✅ Brand and Category filtering
- ✅ Click and conversion event tracking
- ✅ Optimized relevance configuration
- ✅ Responsive product display
- ✅ Pagination support

## Credentials
- App ID: `GCBIM11JSL`
- Index: `assignment_solution`
- Environment: `.env` file (not in repo for security)

## GitHub Repository
https://github.com/prajwalpoovanna/Algolia.git

## Demo Instructions for Spencer & Williams

1. **Show Search Functionality**
   - Demonstrate searching for products (e.g., "camera", "phone")
   - Show brand and category filtering in action
   - Display search results with prices and images

2. **Show Event Tracking**
   - Click "View" button on a product → shows click event in console
   - Click "Add To Cart" button on a product → shows conversion event in console
   - Point to Algolia Dashboard Events Debugger showing received events
   - Screenshot: Dashboard > Data sources > Events

3. **Explain Relevance Configuration**
   - Custom ranking by popularity and rating ensures best results first
   - Camera category discount (20%) automatically applied
   - Faceting enables smart filtering

4. **Answer Customer Questions**
   - Reference `questions/questions.md` for support examples
   - Professional responses to common queries

## Notes
- All console.log statements have been cleaned up for production
- CSS fix: Removed `pointer-events: none` to enable button clicks
- Events are tracked in real-time in Algolia dashboard
