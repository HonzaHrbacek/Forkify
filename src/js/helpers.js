// helpers file for functions that are used all over the app

import { TIMEOUT_SEC } from './config.js';

// helper fce, ktera vraci rejected promise. Pouzije se v pripade, kdy fetch trva prilis dlouho
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function(url) {
  try {

    // response bude prvni fulfilled promise; pokud se url nenacte do 5 sekund, tak zvitezi rejected promise timeout
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
            
    // odpoved si prectu pomoci metody json()
    const data = await res.json();
    
    if (!res.ok) throw new Error(`${data.message} (Response status: ${res.status})`);
    
    //musime vratit tuto promise
    return data;
  } catch(err) {
    // tady znovu vyhodime error, abychom ho mohli osetrit v loadRecipe fci   
    throw err;    
  }
}