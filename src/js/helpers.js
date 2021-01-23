// helpers file for generic helper functions that are used all over the app

import { TIMEOUT_SEC } from './config.js';

// helper fce, ktera vraci rejected promise. Pouzije se v pripade, kdy fetch trva prilis dlouho
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// helper fce pro vraceni dat z fetche/vyhozeni chyby a pro nahrani dat do API 
// pokud existuji upload data, tak nahravame do API, jinak z ni stahujeme data
export const AJAX = async function (url, uploadData = undefined) {  
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    // response bude prvni fulfilled promise; pokud se url nenacte do TIMEOUT_SEC sekund, tak zvitezi rejected promise timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
            
    // odpoved si prectu pomoci metody json()
    const data = await res.json();
    
    if (!res.ok) throw new Error(`${data.message} (Response status: ${res.status})`);
    
    //musime vratit tuto promise
    return data;
  } catch(err) {
    // tady znovu vyhodime error, abychom ho mohli osetrit dale napr. v loadRecipe fci 
    throw err;    
  }
}
