import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //handlery pro tlacitka
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {      
      const button = e.target.closest('.btn--inline');

      if (!button) return;
      
      const goToPage = +button.dataset.goto;
            
      handler(goToPage);      
      
    });
  }
  
  // generovani tlacitek pro paginaci
  _generateMarkup() {
    
    console.log(this._data);

    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages);
    
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
  
    //on page 1 and there are NO other pages
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