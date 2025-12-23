import { DOM } from "./dom.js"

export async function fetchWeather(city) {
  if (!/^[A-Za-z\s\-]+$/.test(city)) {
    DOM.weatherInfo.textContent = '⚠️ 城市名称仅支持英文'
    return
  }
  DOM.weatherInfo.textContent = '加载中...'
  try {
    const response = await fetch(`https://wttr.in/${city}?format=4&m`)
    if (!response.ok) {
      throw new Error('网络响应失败')
    }
    const weatherText = await response.text()
    DOM.weatherInfo.textContent = weatherText.trim()
  } catch
  (error) {
    console.log('获取天气失败', error)
    DOM.weatherInfo.textContent = '⚠️ 天气加载失败'
  }
}