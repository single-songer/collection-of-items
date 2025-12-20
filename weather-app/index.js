const cityInput = document.getElementById('city-input')
const searchBtn = document.getElementById('search-btn')
const loadingEl = document.getElementById('loading')
const errorEl = document.getElementById('error')
const weatherResultEl = document.getElementById('weather-result')
const locationEl = document.querySelector('.location')
const temperatureEl = document.querySelector('.temperature')
const descriptionEl = document.querySelector('.description')
const weatherIconEl = document.querySelector('.weather-icon')
const weatherIcons = {
    0: '☀️', // 晴
    1: '🌤', // 少云
    2: '⛅', // 碎云
    3: '☁️', // 阴
    45: '🌫', // 雾
    48: '🌫', // 霜雾
    51: '🌧', // 小雨
    53: '🌧', // 中雨
    55: '🌧', // 大雨
    61: '🌦', // 小雪
    63: '🌨', // 中雪
    65: '❄️', // 大雪
    95: '⛈', // 雷暴
    96: '⛈', // 雷暴+冰雹
    99: '⛈'  // 强雷暴+冰雹
}
async function getWeather(cityName) {
    try{
        showLoading()
        hideError()
        hideResult()
        // 获取经纬度
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=zh&format=json`);
        const geoData = await geoResponse.json();
        if(!geoData.results || geoData.results.length === 0){
            throw new Error('未找到该城市,请检查拼写')
        }
        const { latitude, longitude,name,country } = geoData.results[0];
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();
        const {current_weather}  = weatherData;
        const temp = Math.round(current_weather.temperature);
        const weatherCode = current_weather.weathercode;
        // 更新ui
        locationEl.textContent = `${name},${country}`
        temperatureEl.textContent = `${temp}°C`
        descriptionEl.textContent = getWeatherDescription(weatherCode)
        weatherIconEl.textContent = weatherIcons[weatherCode] || '🌡'
        showResult()
    }catch (error) {
        console.log(error)
        showError(error.message || '网络错误，请稍后重试')
    }finally{
        hideLoading()
    }
}
// 简单天气描述（可扩展）
function getWeatherDescription(code){
    if(code === 0) return '晴天'
    if([1,2,3].includes(code)) return '多云'
    if([51,53,55].includes(code)) return '降雨'
    if([61,63,65].includes(code)) return '降雪'
    if([95,96,99].includes(code)) return '雷暴'
    return '天气'
}
// UI控制函数
function showLoading(){loadingEl.classList.remove('hidden')}
function hideLoading(){loadingEl.classList.add('hidden')}
function showError(message){ 
    errorEl.textContent = message
    errorEl.classList.remove('hidden')
}
function hideError(){errorEl.classList.add('hidden')}
function showResult(){weatherResultEl.classList.remove('hidden')}
function hideResult(){weatherResultEl.classList.add('hidden')}

searchBtn.addEventListener('click', function () {
    const cityName = cityInput.value.trim()
    if(cityName) getWeather(cityName)
})
cityInput.addEventListener('keypress', (e)=> {
    if(e.key === 'Enter'){
        const cityName = cityInput.value.trim()
        if(cityName) getWeather(cityName)
    }
})
window.addEventListener('load', function () {
    getWeather('北京')
})
