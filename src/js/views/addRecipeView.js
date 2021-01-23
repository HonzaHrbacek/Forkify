import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded ;)'  
  
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
 
  // Okamzite po vygenerovani instance se spusti event listener, ktery bude naslouchat, jestli uzivatel kliknul na tlacitko pro pridani vlastniho receptu a zavreni vyskakujiciho okna
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }
  
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); //musime manualne nastavit this na aktualni objekt, jinak bude nastaveno na event listener element
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function(e) {
      e.preventDefault();
      // FormData browser API vytvori novy objekt FormData, ktery pomoci spread operatoru muzeme rozlozit a vlozit do pole poli
      const dataArr = [...new FormData(this)];
      // Z pole poli si pomoci fromEntries udelame objekt
      const data = Object.fromEntries(dataArr);
      handler(data);      
    })
  }

  _generateMarkup() {

  }

}

export default new AddRecipeView();