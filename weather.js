document.addEventListener('DOMContentLoaded', () => {
    const tempElement = document.getElementById('temp');
    const locationElement = document.getElementById('location');

    // Coordinates for Caldwell, NJ
    const lat = 40.8398;
    const lon = -74.2765;

    async function fetchWeather() {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`);
            const data = await response.json();

            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                tempElement.textContent = `${temp}°F`;
                locationElement.textContent = "Caldwell, NJ";
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            tempElement.textContent = "--°F";
        }
    }

    fetchWeather();

    // Refresh weather every 30 minutes
    setInterval(fetchWeather, 1800000);
});
