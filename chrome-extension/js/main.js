/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

// var socket = io.connect('http://localhost:8080');
// socket.on("hello",function(data){
// 	console.log(data.text);
// 	chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
// });