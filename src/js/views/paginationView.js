import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Handler pro tlacitka
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {      
      // Eventlistener je na parent elementu pagination. Pokud uzivatel klikne dovnitr buttonu i na child elementy, pres metodu closest zamerime cely button.
      const button = e.target.closest('.btn--inline');
      console.log(button);

      // Guard close, pokud uzivatel klikne v ramci pagination divu mimo button.
      if (!button) return;
      
      // Buttony maji na sobe data atribut goto, ktery slouzi jako premosteni mezi UI a datovou strukturou. Pomoci nej si precteme, na jakou stranku chce uzivatel ji  a zobrazime mu ji.
      const goToPage = +button.dataset.goto;
            
      // Event handler (controlPagination) volame s atributem goToPage, tj. cislo stranky, na kterou chce uzivatel jit
      handler(goToPage);    
      
    });
  }
  
  // Generovani tlacitek pro paginaci
  _generateMarkup() {    
    // Celkovy pocet stranek k zobrazeni
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    
    // Alternative scenarios of pagination:
    // on page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `<button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
      <span>${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
  
    //on page 1 and there are NO other pages (napr. pro query saffron :))
    if (numPages === 1) {
      return '';
    }
  
    // on the last page
    if (this._data.page === numPages) {
      return `<button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${this._data.page - 1}</span>
    </button>`;
    }
  
    // on some other page
    if (this._data.page < numPages) {      
      return `<button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${this._data.page - 1}</span>
    </button>
    <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
      <span>${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
  }
}

export default new PaginationView;