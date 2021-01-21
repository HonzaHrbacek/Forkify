import { async } from "regenerator-runtime"
import { API_URL } from "./config";
import { getJSON, RES_PER_PAGE } from './helpers.js';

// state mi zachycuje aktualni stav aplikace pro recipe (vybrany recept), search results a bookmarks
export const state = {

  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage = RES_PER_PAGE
  } 

}

export const loadRecipe = async function(id) {
try {
  // fce getJOSN vraci promise, takze ji musime awaitovat
  const data = await getJSON(`${API_URL}${id}`);
  
  // destructuring property/objektu recipe
  let {recipe} = data.data;

  // ulozeni do state
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
  // console.log(state.recipe);
} catch(err) {
  //aby se err objekt dostal do controlleru, musime opet provest throw
  throw err;
}
}

export const loadSearchResults = async function(query) {
  try {

    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
  
    // console.log(data.data.recipes);
    
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
    console.log(err);
    
    throw err;
  }
}

export const getSearchResultsPage = function (page) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  
  return state.search.results.slice(start, end);
}

