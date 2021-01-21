import { async } from "regenerator-runtime"

// state mi zachycuje aktualni stav aplikace pro recipe (vybrany recept), search results a bookmarks
export const state = {

  recipe: {},

}

export const loadRecipe = async function(id) {
try {
  const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
      
  // odpoved si prectu pomoci metody json()
  const data = await res.json();
  
  if (!res.ok) throw new Error(`${data.message} (Response status: ${res.status})`);
  
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
  console.error(err);
  // alert(err);  
}

}