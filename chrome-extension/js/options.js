/*
** file: js/options.js
** description: javascript code for "html/options.html" page
*/

function init_options () {
    console.log("function: init_options");

    //load currently stored options configuration
    // var favorite_movie = localStorage['favorite_movie'];
	// var email=document.getElementById('email-input').value;
    //set the current state of the options form elements to match the stored options values
    //favorite_movie
    // if (favorite_movie) {
    //     var favorite_movie_dropdown = document.getElementById('favorite-movie-dropdown');
    //     for (var i=0; i < favorite_movie_dropdown.children.length; i++) {
    //         var option = favorite_movie_dropdown.children[i];
    //         if (option.value == favorite_movie) {
    //             option.selected = 'true';
    //             break;
    //         }
    //     }
    // }
	var email = localStorage['email'];
    if (email){
			document.getElementById('email-input').value=email;
    }
}

function save_options () {
    console.log("function: save_options");

    //favorite-movie-dropdown
    // var favorite_movie = document.getElementById('favorite-movie-dropdown').children[document.getElementById('favorite-movie-dropdown').selectedIndex].value;
    var email = document.getElementById('email-input').value;
    // localStorage['favorite_movie'] = favorite_movie;
    localStorage['email'] = email;
    // console.log("favorite_movie = " + favorite_movie);
    console.log("email = " + email);
		window.close();

}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_options);
document.querySelector('#save-options-button').addEventListener('click', save_options);