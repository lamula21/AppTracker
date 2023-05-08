// When the user scrolls the page, execute scrollTracker
window.onscroll = function () {
	scrollTracker()
}

function scrollTracker() {
	var winScroll =
		document.body.scrollTop || document.documentElement.scrollTop
	var height =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight
	var scrolled = (winScroll / height) * 100
	document.getElementById('myBar').style.width = scrolled + '%'
}
