const body = document.body
const toggle = document.querySelector('#theme-toggle')
const saveTheme = localStorage.getItem('theme')

if (saveTheme === 'dark') {
  body.classList.add('.dark-theme')
  toggle.textContent = '☀️'
}
toggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme')
  if (body.classList.contains('dark-theme')) {
    toggle.textContent = '☀️'
    localStorage.setItem('theme', 'dark')
  } else {
    toggle.textContent = '🌙'
    localStorage.setItem('theme', 'light')
  }
})
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, { threshold: 0.1 })
document.querySelectorAll('.fade-in-section').forEach((el) => observer.observe(el))