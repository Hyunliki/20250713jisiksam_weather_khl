// WeatherAPI 설정
const API_KEY = '8f0665fc45a64152b2321101250806';
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// 날씨 정보를 표시할 요소들
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const errorMessage = document.getElementById('errorMessage');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 날씨 검색 함수
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('도시명을 입력해주세요.');
        return;
    }
    
    showLoading();
    hideError();
    hideWeather();
    
    try {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
    } catch (err) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', err);
        showError('날씨 정보를 가져올 수 없습니다. 도시명을 확인해주세요.');
    } finally {
        hideLoading();
    }
}

// WeatherAPI에서 날씨 데이터 가져오기
async function fetchWeatherData(city) {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('도시를 찾을 수 없습니다.');
        } else if (response.status === 401) {
            throw new Error('API 키가 유효하지 않습니다.');
        } else {
            throw new Error('서버 오류가 발생했습니다.');
        }
    }
    
    return await response.json();
}

// 날씨 정보 표시
function displayWeather(data) {
    const location = data.location;
    const current = data.current;
    
    // 도시명과 시간
    cityName.textContent = `${location.name}, ${location.country}`;
    dateTime.textContent = formatDateTime(location.localtime);
    
    // 온도
    temperature.textContent = Math.round(current.temp_c);
    
    // 날씨 설명
    weatherDescription.textContent = current.condition.text;
    
    // 날씨 아이콘
    weatherIcon.className = getWeatherIcon(current.condition.code, current.is_day);
    
    // 상세 정보
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;
    
    showWeather();
}

// 날씨 아이콘 매핑
function getWeatherIcon(code, isDay) {
    const iconMap = {
        1000: isDay ? 'fas fa-sun' : 'fas fa-moon', // 맑음
        1003: isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon', // 구름 조금
        1006: 'fas fa-cloud', // 구름 많음
        1009: 'fas fa-cloud', // 흐림
        1030: 'fas fa-smog', // 안개
        1063: 'fas fa-cloud-rain', // 가벼운 비
        1066: 'fas fa-snowflake', // 가벼운 눈
        1069: 'fas fa-cloud-rain', // 가벼운 비/눈
        1087: 'fas fa-bolt', // 천둥번개
        1114: 'fas fa-snowflake', // 가벼운 눈
        1117: 'fas fa-snowflake', // 눈
        1135: 'fas fa-smog', // 안개
        1147: 'fas fa-smog', // 짙은 안개
        1150: 'fas fa-cloud-rain', // 가벼운 이슬비
        1153: 'fas fa-cloud-rain', // 이슬비
        1180: 'fas fa-cloud-rain', // 가벼운 비
        1183: 'fas fa-cloud-rain', // 비
        1186: 'fas fa-cloud-rain', // 중간 비
        1189: 'fas fa-cloud-rain', // 중간 비
        1192: 'fas fa-cloud-rain', // 강한 비
        1195: 'fas fa-cloud-rain', // 매우 강한 비
        1225: 'fas fa-snowflake', // 매우 강한 눈
        1252: 'fas fa-cloud-rain', // 가벼운 비/눈
        1255: 'fas fa-cloud-rain', // 비/눈
        1258: 'fas fa-cloud-rain', // 중간 비/눈
        1261: 'fas fa-cloud-rain', // 가벼운 비/눈
        1264: 'fas fa-cloud-rain', // 비/눈
        1273: 'fas fa-bolt', // 가벼운 비/천둥번개
        1276: 'fas fa-bolt', // 비/천둥번개
        1279: 'fas fa-bolt', // 가벼운 눈/천둥번개
        1282: 'fas fa-bolt' // 눈/천둥번개
    };
    
    return iconMap[code] || 'fas fa-cloud';
}

// 날짜/시간 포맷팅
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('ko-KR', options);
}

// UI 상태 관리 함수들
function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showWeather() {
    weatherContainer.classList.add('show');
}

function hideWeather() {
    weatherContainer.classList.remove('show');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.add('show');
}

function hideError() {
    error.classList.remove('show');
}

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    // 입력 필드에 포커스
    cityInput.focus();
    
    // 기본 도시로 서울 검색 (선택사항)
    // cityInput.value = 'Seoul';
    // searchWeather();
});

// 날씨 아이콘 애니메이션 효과
function animateWeatherIcon() {
    weatherIcon.style.animation = 'none';
    weatherIcon.offsetHeight; // 리플로우 트리거
    weatherIcon.style.animation = 'float 3s ease-in-out infinite';
}

// 검색 버튼 클릭 시 아이콘 애니메이션
searchBtn.addEventListener('click', () => {
    setTimeout(animateWeatherIcon, 500);
});

// 입력 필드 클리어 기능
cityInput.addEventListener('input', () => {
    if (cityInput.value === '') {
        hideWeather();
        hideError();
    }
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K로 검색창 포커스
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        cityInput.focus();
        cityInput.select();
    }
    
    // Escape로 검색창 클리어
    if (e.key === 'Escape') {
        cityInput.value = '';
        cityInput.focus();
        hideWeather();
        hideError();
    }
});
