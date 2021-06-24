import View from './View.js';
import previewView from './previewView.js';

import icons from 'url:../../img/icons.svg';


class ResultsView extends View{


_parentElement = document.querySelector('.results');
_errorMessage = 'Oops..!! Sorry No recipe found for you query, Please try again with another words';
_message = '';






_generateMarkup() {


        console.log(this._data);
            return this._data.map(result => previewView.render(result, false)).join('');






}



}


export default new ResultsView();
