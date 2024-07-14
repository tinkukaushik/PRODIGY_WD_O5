document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "7d0b483c1264b385cb6b5b391566d1ed"; // Your OpenWeatherMap API key
    const form = document.getElementById("locationForm");
    const locationInput = document.getElementById("locationInput");
    const weatherDisplay = document.getElementById("weatherDisplay");
    const locationName = document.getElementById("locationName");
    const temperature = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const wind = document.getElementById("wind");
    const weatherIcon = document.getElementById("weatherIcon");
    const countryFlag = document.getElementById("countryFlag");
    const mapContainer = document.getElementById("map");

    let map;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const location = locationInput.value;
        fetchWeather(location);
    });

    function fetchWeather(location) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.cod === 200) {
                    updateWeatherDisplay(data);
                    updateMap(data.coord.lat, data.coord.lon);
                } else {
                    alert("Location not found. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                alert("Error fetching weather data: " + error.message);
            });
    }

    function updateWeatherDisplay(data) {
        locationName.textContent = data.name;
        temperature.textContent = `Temperature: ${data.main.temp}°C`;
        condition.textContent = `Condition: ${data.weather[0].description}`;
        wind.textContent = `Wind: ${data.wind.speed} m/s, ${data.wind.deg}°`;
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        fetchCountryFlag(data.sys.country);
        weatherDisplay.classList.remove("hidden");
    }

    function fetchCountryFlag(countryCode) {
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
        countryFlag.src = flagUrl;
    }

    function updateMap(lat, lon) {
        if (map) {
            map.setView([lat, lon], 13);
        } else {
            map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    updateWeatherDisplay(data);
                    updateMap(lat, lon);
                })
                .catch(error => {
                    console.error("Error fetching weather data:", error);
                    alert("Error fetching weather data: " + error.message);
                });
        });
    }
});
