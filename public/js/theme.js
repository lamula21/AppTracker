const toggle = document.getElementById('toggleDark')
const body = document.querySelector('body')
let theme = localStorage.getItem('theme')
const i = document.querySelector('.bi')
const logo = document.querySelector('header .logo')
const anchors = document.querySelectorAll('header ul li a')
//const scrollBar = document.querySelector('.containerBar')

const enableDark = () => {
	body.style.background = '#181a1b'
	body.style.color = 'white'
	body.style.transition = '2s'
	localStorage.setItem('theme', 'dark')
	i.classList.replace('bi-brightness-high-fill', 'bi-moon')
	logo.classList.toggle('dark')
	anchors.forEach((anchor) => {
		anchor.classList.toggle('dark')
	})
	//scrollBar.classList.toggle('dark')

	// Add more dark-mode elements (home.css for styling)
}

const enableLight = () => {
	body.style.background = 'white'
	body.style.color = 'black'
	body.style.transition = '2s'
	localStorage.setItem('theme', 'light')
	i.classList.replace('bi-moon', 'bi-brightness-high-fill')
	if (logo.classList.contains('dark')) {
		logo.classList.toggle('dark')
	}
	if (anchors[0].classList.contains('dark')) {
		anchors.forEach((anchor) => {
			anchor.classList.toggle('dark')
		})
	}

	// if (scrollBar.classList.contains('dark')) {
	// 	scrollBar.classList.toggle('dark')
	// }

	// Add more light-mode elements (home.css for styling)
	// Check if `dark` attribute exists then toggle('dark`)
}

// set state of darkMode on page load
if (theme === 'dark') {
	enableDark()
} else if (theme === 'light') {
	enableLight()
}

toggle.addEventListener('click', function () {
	this.classList.toggle('bi-moon')
	if (this.classList.toggle('bi-brightness-high-fill')) {
		enableLight()
	} else {
		enableDark()
	}
})
