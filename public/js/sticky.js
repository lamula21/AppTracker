window.addEventListener('scroll', function () {
	let header = document.querySelector('header')
	let flashContainer = document.querySelector('.alert-container')
	header.classList.toggle('sticky', window.scrollY > 0)
	flashContainer.classList.toggle('sticky', window.scrollY > 0)

	// let containerBar = document.querySelector('.containerBar')
	// containerBar.classList.toggle('stick', window.scrollY > 0)

	if (localStorage.getItem('theme') === 'dark') {
		header.classList.toggle('dark', window.scrollY > 0)
	}
})
