// import vseho (defaultni) z modulu Model
import * as model from './model.js';
// import instance classy RecipeView atd.
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';


// import knihoven pro asynchronni JS
import 'core-js/stable';
import 'regenerator-runtime/runtime';


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

    // 2) Load search results
    await model.loadSearchResults(query);
    
    // 3) Render results
    console.log(model.state.search);
    
  } catch(err) {
    console.log(err);
    
  }
  
}

controlSearchResults();

const init = function() {
  // event handling v MVC pres publisher-subscriber pattern: event listener ma jako parametr fci, ktera je event handler
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
}

init();
