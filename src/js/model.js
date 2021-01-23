import { async } from "regenerator-runtime"
import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from './helpers.js';

// state mi zachycuje aktualni stav aplikace pro recipe (vybrany recept), search results a bookmarks
export const state = {

  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [] 

}

// aktualizuje state co se tyce vybraneho receptu
export const loadRecipe = async function(id) {
try {
  // fce getJOSN vraci promise, takze ji musime awaitovat
  const data = await getJSON(`${API_URL}${id}`);
  
  // destructuring property/objektu recipe
  let {recipe} = data.data;

  // preulozeni recipe do state
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients
  }

  // Overeni, jestli je recept mezi bookmarkovanymi. Toto je potreba napr. pro nasledne spavne zobrazeni bookmarkovaci ikony.
  if (state.bookmarks.some(bookmark => bookmark.id === id))
  state.recipe.bookmarked = true;
else state.recipe.bookmarked = false;

} catch(err) {
  //aby se err objekt dostal do controlleru, musime opet provest throw, abychom ho mohli osetrit spravnou chybovou hlaskou
  throw err;
}
}

// aktualizuje state co se tyce vysledku hledani dle zadaneho query
export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
      
    // recipes jso pole, takze ho pomoci map prevedeme na pole vysledku hledani, ktere mame ve state (pouzivame stejne klice jako ve state.recipe)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url
      };
    }
    );
  
  } catch(err) {    
    throw err;
  }
}

// nastavuje data pro pagination, defaultne je uzivatel po zobrazeni vysledku hledani na prvni strance
export const getSearchResultsOnCurrentPage = function (page = 1) {
  // pri kazdem volani fce se aktualizuje state co se tyce aktualni stranky
  state.search.page = page;
  
  // algorytmus definujici prvni a posledni polozku (preview receptu) zobrazenou na strance v zavislosti na aktualni strance
  const start = (page - 1) * state.search.resultsPerPage; // stranka 1 -> 0, stranka 2 -> 10, ...
  const end = page * state.search.resultsPerPage; // stranka 1 -> 10, stranka 2 -> 20, ...
  
  return state.search.results.slice(start, end); // stranka 1 -> polozky (0 - 9), stranka 2 -> polozky (10 - 19), ...
}

export const updateServings = function (newServings) {
  // Vypocitame nove hodnoty ingredienci podle noveho poctu porci
  state.recipe.ingredients.forEach(ing => { ing.quantity = ing.quantity * newServings / state.recipe.servings});
 
  // Novou hodnotu porci ulozime do state
  state.recipe.servings = newServings;
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
  // Add new bookmark to state
  state.bookmarks.push(recipe);

  // Store the bookmarks to localStorage
  persistBookmarks();
  
  // Mark current recipe as bookmarked
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;    
  } 
}

export const deleteBookmark = function (id) {
  // Delette bookmark from state
  const index = state.bookmarks.findIndex(bookm => bookm.id === id);
  
  state.bookmarks.splice(index,1);

  // Store the bookmarks to localStorage
  persistBookmarks();
  
  // Unbookmark current recipe
  if (state.recipe.id === id) {
    state.recipe.bookmarked = false;    
  } 
}

const init = function() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
console.log(state.bookmarks);
