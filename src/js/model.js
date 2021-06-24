import { API_URL, RES_PER_PAGE, KEY } from './config.js';

// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';


export const state = {

        recipe: {},
        search: {

                  query: '',
                  results: [],
                  page: 1,
                  resultPerPage: RES_PER_PAGE
        },
        bookmarks: []


};



const createRecipeObject = function (data) {

        const { recipe }  = data.data;
    return state.recipe = {

            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourseUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key})

        };


};



export const loadRecipe = async function(id) {

  try{

    const data = await AJAX(`${API_URL}${id}`);

    console.log(data);

          state.recipe = createRecipeObject(data);

           if (state.bookmarks.some(bookmark => bookmark.id === id))

              state.recipe.bookmarked = true;
           else state.recipe.bookmarked = false;




  console.log(state.recipe);



} catch (err) {

        console.log(`${err} ****model catch block of async loadRecipe fun****`);
        throw err;
}
};



export const loadSearchResults = async function (query) {

          try {

                state.search.query = query;
                  const data = await AJAX(`${API_URL}?search=${query}`);
                  console.log(data);



                state.search.results = data.data.recipes.map(rec => {

                        return {


                                         id: rec.id,
                                         title: rec.title,
                                         publisher: rec.publisher,
                                         image: rec.image_url

                        };

                  });

                  state.search.page = 1;

                  if(!data) throw new Error(`${error.meaasage} (${error.status})`)



          } catch (e) {
            console.log(`${err} ****model catch block of async loadRecipe fun****`);
            throw err;
          }


};



export const getSearchResultsPage = function(page = state.search.page) {

            state.search.page = page;

            const start = (page-1) * state.search.resultPerPage;
            const end = page * state.search.resultPerPage;

            return state.search.results.slice(start, end);

};
export const updateServings = function(newServings) {

      state.recipe.ingredients.forEach(ing => {

                ing.quantity =( ing.quantity * newServings )/ state.recipe.servings;

                  //newQt = oldQt * newServings / oldServings // 2 * 8/4

      });

     state.recipe.servings = newServings;

};


const presistBookmarks = function() {


      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

}


export const addBookmark = function(recipe) {

  //Add bookmark
      state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
      if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

      presistBookmarks();

};


export const deleteBookmark = function(id) {

  //Add bookmark
      const index = state.bookmarks.findIndex(el => el.id === id);

      state.bookmarks.splice(index, 1);

          //Mark current recipe as not bookmarked
            if (state.recipe.id === id) state.recipe.bookmarked = false;

            presistBookmarks();

};

const init = function () {

            const storage = localStorage.getItem('bookmarks');
            if(storage) state.bookmarks = JSON.parse(storage);


}

init();


const clearBookmarks = function() {

        localStorage.clear('bookmarks');

};

// clearBookmarks();


export const uploadRecipe = async function(newRecipe) {

      try {
        console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe).filter(
          entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        ).map(ing => {

        const ingArr = ing[1].split(',').map(el => el.trim());

        let [quantity, unit, description] = ingArr;
        if(ingArr.length !== 3) throw new Error('Wrong ingredient format!!, Please use the correct format');

          return {quantity: quantity ? +quantity : null, unit, description}
        });


        const recipe = {

             title: newRecipe.title,
             publisher: newRecipe.publisher,
             source_url: newRecipe.sourceUrl,
             image_url: newRecipe.image,
             servings: +newRecipe.servings,
             cooking_time: +newRecipe.cookingTime,
             ingredients

         }


  console.log(recipe);

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  console.log(data);

  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);

} catch (err) {
        throw err;
      }






}
