import icons from 'url:../../img/icons.svg';

// Parent class, od ktere sub classy jednotlivych view dedi vlastnosti a metody
export default class View {
  // Protected vlastnost data
  _data;

  // Public API metoda vykreslujici recept do UI
  render(data) {
    // Guard clause: pokud data neexistuji (napr. neexistujici recept, tedy hash) nebo jsou prazdne pole (pokud vyhledam query, ktere pro ktere nejsou zadne recepty), tak se vypise chybova hlaska    
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    
    // Vygeneruji si markup (napr. anotaci receptu)
    const markup = this._generateMarkup();
    
    // Vycistim si parent element (to je dulezete, napr. pro pagination)
    this._clear();

    // Zobrazim markup v parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    
    this._data = data;
    
    // Vygeneruji si novy markup (string)
    const newMarkup = this._generateMarkup();
  
    // Konvertuji novy markup do DOM node objektu (neco jako virtualni DOM)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Node listy si prevedeme na pole
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Porovname aktualni a novy markup
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // Nahrazeni provedeme pouze pokud se novy node lisi od stareho a pokud se jedna o text (v tom pripade se hodnota vlastnosti noveValue rovna textu; elementy maji tuto hodnotu null)
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Zmena atributu na buttonech novych elementu na atributy, ktere maji nove elementy
      if (!newEl.isEqualNode(curEl)) {

        // Toto nam vrati objekt atributu novych nodu, ktery si prevedeme na pole
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));        
      } 

    })
    
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

