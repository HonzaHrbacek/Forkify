import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { loadRecipe } from './model.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
    // alert(err.message);
    console.error(err);    
  }
}

// ? Toto najednou vyhazuje chybu: controller.3560e144.js:512 Uncaught TypeError: Cannot read property 'forEach' of undefined
    // at Object.175e469a7ea7db1c8c0744d04372621f.core-js/modules/es.typed-array.float32-array.js (controller.3560e144.js:512)
    // at newRequire (controller.3560e144.js:68)
    // at controller.3560e144.js:111
    // at controller.3560e144.js:134
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));

window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes);

