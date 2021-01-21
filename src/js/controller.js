// import vseho (defaultni) z modulu Model
import * as model from './model.js';
// import instance classy RecipeView atd.
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

// import knihoven pro asynchronni JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Parcel feature, that does not reload the page if change is made in the code. Useful for development.
// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

// Load and render recipe
const controlRecipes = async function() {

  try {
    // kazdy recept ma v url hash ve tvaru #id; takto ziskame pouze id
    const id = window.location.hash.slice(1);
    
    // guard clause pro pripad, ze se stranka nacita bez hashe, tj. user si nevybral recept
    if (!id) return;
    
    // spusti spinner v komponente recipeView
    recipeView.renderSpinner();
    
    // 1) Loading recipe
    // LoadRecipe nic nevraci, proto vysledek jeji promise neukladame do promenne. ALe musime ji awaitovat, protoze uklada property recipe do objektu state, kterou zobrazujeme nize pomoci metody render. 
    await model.loadRecipe(id);

    // 2) Rendering recipe   
    recipeView.render(model.state.recipe);
  } catch(err) {
    console.error(`${err} 🔥🔥🔥`);
    recipeView.renderError();
  }
}

const controlSearchResults = async function() {
  try {
    // 1) Get search query
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResults(query);
    
    // 3) Render results    
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);    
    
  } catch(err) {
    console.log(err);
    
  }
  
}

const controlPagination = function (gotopage) {
  // 1} Render new results and also set page to gotopage value
  resultsView.render(model.getSearchResultsPage(gotopage));
  
  // 2) Render new pagination buttons
  paginationView.render(model.state.search);  
  
};

controlSearchResults();

const init = function() {
  // event handling v MVC pres publisher-subscriber pattern: event listener ma jako parametr fci, ktera je event handler
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}

init();
