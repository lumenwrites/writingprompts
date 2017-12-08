import './vendor/popper.min.js'
import './vendor/bootstrap.min.js'
import './vendor/mousetrap.min.js'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


$( document ).ready(function() {

    $('.refresh').click(function() {
	/* Every time I click, I rotate data in data attribute,
	   and replace prompt with the first element in the array.
	   Allows me to super elegantly cycle through prompts. */
	var dataWrapper = $(this).parent().parent()
	var prompts = dataWrapper.data('prompts')
	/* takes first prompt and moves it to the end of the array */
	prompts.push(prompts.shift())
	/* Update data */
	dataWrapper.data('prompts', prompts)	
	/* replace the prompt text or image, whichever one is there. */
	dataWrapper.find('.text-prompt').text(prompts[0])
	dataWrapper.find('.image-prompt').attr('src',prompts[0])
    })
    
    $('#refresh-settings-text-prompt').click(function(){
	const random = getRandomInt(0,SETTINGS.length - 2)
	arr.push(arr.shift())
	$('#settings-text-prompt').text('heyah!')
    })

    $('#refresh-settings').click(function(){
	const random_int = getRandomInt(0,SETTINGS.length - 2)
	
	console.log(random_int)

	$('#settings').attr('src', SETTINGS[random_int]);
    })

    /* Turn on dark interface */
    if (localStorage.getItem("darkInterface")) {
	var headID = document.getElementsByTagName("head")[0];
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = '/static/styles/css/dark.css';
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
    }
    
})

/* Hotkeys */
/* Dark interface */
function toggleDarkInterface() {
    if (localStorage.getItem("darkInterface")) {
	/* Remove dark style */
	localStorage.removeItem("darkInterface");
	$("link[href='/static/styles/css/dark.css']").remove();
    } else {
	localStorage.setItem("darkInterface", true);
	/* Add link to the style to head */
	var headID = document.getElementsByTagName("head")[0];
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = '/static/styles/css/dark.css';
	cssNode.media = 'screen';
	headID.appendChild(cssNode);
    }
}
Mousetrap.bind('d', function(e) {
    toggleDarkInterface();
});
$( "#toggleDarkInterface" ).click(function() {
    toggleDarkInterface();
})
