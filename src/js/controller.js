import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';



import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';

import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';



console.log(recipeView );
import 'core-js/stable';
import 'regenerator-runtime/runtime';




// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes = async function() {


      try {

        const id = window.location.hash.slice(1);

        if(!id) return;

        console.log(id);

        recipeView.renderSpinner();
        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);

        // 1) Loading recipe

         await model.loadRecipe(id);
         console.log('ahmed');





         //2) Rendering recipe
         console.log(model.state.recipe);
        recipeView.render(model.state.recipe);



      } catch (err) {

            console.log(err);
            recipeView.renderError();

      }


};

const controlSearchResults = async function() {

    try {

      resultsView.renderSpinner();

      console.log(resultsView);

      const query = searchView.getQuery();

      if(!query) return;

      await model.loadSearchResults(query);



      // resultsView.render(model.state.search.results);
      resultsView.render(model.getSearchResultsPage());


      //render initial pagination buttons
      paginationView.render(model.state.search);


    } catch (err) {
      console.log(err);

}


};



const controlPagination = function(goToPage) {

        // Render new results
        resultsView.render(model.getSearchResultsPage(goToPage));


        //render new pagination buttons
        paginationView.render(model.state.search);


};


const controlServings = function(newServings) {

      //update the recipe servings (in state)
      model.updateServings(newServings);
      //update the recipe view
      // recipeView.render(model.state.recipe);
      recipeView.update(model.state.recipe);



};


const controlAddBookmark = function() {


//1) Add/Remove bookmark

if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
else if(model.state.recipe.bookmarked)  model.deleteBookmark(model.state.recipe.id);

        console.log(model.state.recipe);
        // 2) update recipe view
        recipeView.update(model.state.recipe);

        // 3) Render bookmarks
        bookmarksView.render(model.state.bookmarks);

};

const controlBookmarks = function() {

            bookmarksView.render(model.state.bookmarks);

};


const controlAddRecipe =async function(newRecipe) {

              try {

                //Render spinner
                addRecipeView.renderSpinner();
                // console.log(newRecipe);
                await model.uploadRecipe(newRecipe);

                console.log(model.state.recipe);
                //upload new Recipe data

              //Render recipe
              recipeView.render(model.state.recipe);

              //Render success message
              addRecipeView.renderMessage();

              //Render bookmark view
              bookmarksView.render(model.state.bookmarks);

              //change id in URL
              window.history.pushState(null, '',  `#${model.state.recipe.id}`);

              //close form window
              setTimeout(function() {

                  addRecipeView.toggleWindow()

              }, MODAL_CLOSE_SEC * 1000);

              } catch (err) {

                console.log('eooooeoe', err);
                addRecipeView.renderError(err.message);

              }

}


const init = function() {
        bookmarksView.addHandlerRender(controlBookmarks);
        recipeView.addHandlerRender(controlRecipes);
        recipeView.addHandlerUpdateServings(controlServings);
        recipeView.addHandlerAddBookmark(controlAddBookmark);


        searchView.addHandlerSearch(controlSearchResults);
        paginationView.addHandlerClick(controlPagination);
        addRecipeView.addHandlerUpload(controlAddRecipe);


};


init();
