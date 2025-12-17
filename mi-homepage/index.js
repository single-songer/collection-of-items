const body = document.body
const toggle = document.querySelector('#theme-toggle')
const saveTheme = localStorage.getItem('theme')
const cartList = document.querySelectorAll('.add-to-cart')
if (saveTheme === 'dark') {
  body.classList.add('dark-theme')
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
cartList.forEach((cart) => {
  cart.addEventListener('click', function () {
    this.classList.add('.added')
    this.textContent = "√ 已添加"
    setTimeout(() => {
      this.textContent = "加入购物车"
      this.classList.remove('.added')
    }, 2000)
  })
})