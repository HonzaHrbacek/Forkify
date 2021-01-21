import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  //public API metoda vykreslujici recept do UI
  render(data) {
    // guard clause: pokud data neexistuji nebo jsou prazdne pole, tak se vypise chybova hlaska    
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    // vygeneruji si markup (anotaci receptu)
    const markup = this._generateMarkup();
    //vycistim si parent element
    this._clear();
    //zobrazim markup v parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  
  _clear() {    
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-alert-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
  this._clear();
  this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }


}

