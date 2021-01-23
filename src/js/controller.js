// import vseho (defaultni) z modulu Model
import * as model from './model.js';
// import instance classy RecipeView atd.
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// import knihoven pro asynchronni JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Parcel feature, that does not reload the page if change is made in the code. Sometimes useful for development.
// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

// Load and render recipe
const controlRecipes = async function() {
  try {
    // kazdy recept ma v url hash ve tvaru #id; takto ziskame pouze id
    const id = window.location.hash.slice(1);
    
    // guard clause pro pripad, ze se stranka nacita bez hashe, tj. user si zatim nevybral recept k zobrazeni
    if (!id) return;
    
    // spusti spinner v komponente recipeView
    recipeView.renderSpinner();
    
    // 0) Update results view to mark selected search result (preview) with active class
    resultsView.update(model.getSearchResultsOnCurrentPage());

    
    // 1) Loading recipe
    // LoadRecipe nic nevraci, proto vysledek jeji promise neukladame do promenne. ALe musime ji awaitovat, protoze uklada property recipe do objektu state, kterou zobrazujeme nize pomoci metody render. 
    await model.loadRecipe(id);
    
    // 2) Rendering recipe   
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
    
    // 3) Update the bookmarks view (add active class to selected recipe)
    bookmarksView.update(model.state.bookmarks); 

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
    resultsView.render(model.getSearchResultsOnCurrentPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);    
    
  } catch(err) {
    console.log(err);    
  }  
}

const controlPagination = function (gotopage) {
  // 1} Render new results and also set page to gotopage value
  resultsView.render(model.getSearchResultsOnCurrentPage(gotopage));
  
  // 2) Render new pagination buttons
  paginationView.render(model.state.search);    
};

const controlUpdateServings = function (newServings) {
  // Update servings in state
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe); // Render prepise cely parent element, coz neni efektivni
  recipeView.update(model.state.recipe);
}

const controlUpdateBookmarks = function () {
  // 1) Add or delete bookmark
  if (!model.state.recipe.bookmarked) 
    model.addBookmark(model.state.recipe);      
   else 
    model.deleteBookmark(model.state.recipe.id);    
  
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render boomarks view
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}

const init = function() {
  // Event handling v MVC pres publisher-subscriber pattern: event listener ma jako parametr fci, ktera je event handler
  
  // Po kliknuti na search button se zobrazi recepty dle zadaneho query
  bookmarksView.addHandlerRender(controlBookmarks);
  // Preview receptu se zobrazi pri hashchange v url nebo pri reloadu stranky
  recipeView.addHandlerRender(controlRecipes);
  // Pridavani/odebirani servings (porci)
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  // Pridani/odebirani bookmarku
  recipeView.addHandlerUpdateBookmarks(controlUpdateBookmarks);
  // Po kliknuti na search button se zobrazi recepty dle zadaneho query
  searchView.addHandlerSearch(controlSearchResults);
  // Defaultne se zobrazi prvni stranka s moznosti prejit na druou stranku (pokud existuje vice nez RES_PER_PAGE receptu). Po klinuti na paginacni tlacitka se zobrazi patricna cast vyhledanych receptu a spravna tlacitka podle toho, v jake casti seznamu se uzivatel nachazi (prvni stranka, posledni stranka, ...)
  paginationView.addHandlerClick(controlPagination);
}

init();
