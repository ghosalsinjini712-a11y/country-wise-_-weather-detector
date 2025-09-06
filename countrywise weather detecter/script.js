const weatherApiKey = 'd66c343dc106ed81601122a06bac5f99'
async function searchCountryWeather() {
  const countryName = document.getElementById('countryInput').value.trim();
  const resultDiv = document.getElementById('result');

  if (!countryName) {
    resultDiv.innerHTML = '<p>Please enter a country name.</p>';
    return;
  }

  try {
    // Step 1: Get country details
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryRes.json();

    if (!countryRes.ok || !countryData[0]) {
      resultDiv.innerHTML = `<p>Country not found.</p>`;
      return;
    }

    const country = countryData[0];
    const capital = country.capital?.[0] || 'Unknown';
    const flagUrl = country.flags?.png || '';
    const region = country.region || 'Unknown';
    const population = country.population?.toLocaleString() || 'Unknown';

    // Step 2: Get weather for capital city
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}&units=metric`);
    const weatherData = await weatherRes.json();

    if (!weatherRes.ok || weatherData.cod !== 200) {
      resultDiv.innerHTML = `<p>Weather data not found for capital city: ${capital}</p>`;
      return;
    }

    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase(); // e.g., "rain", "clear", "snow", "clouds"

    // Step 3: Set dynamic background
    let backgroundUrl = '';
    if (condition.includes('rain')) {
  backgroundUrl = 'https://images.unsplash.com/photo-1527766833261-b09c3163a791'; // Rain
} else if (condition.includes('snow') || temp < 5) {
  backgroundUrl = 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b'; // Cloudy
} else if (condition.includes('clear') || condition.includes('sun')) {
  backgroundUrl = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9'; // Sunny
} else {
  backgroundUrl = 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63'; // Default blue cloud
}


    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';

    // Step 4: Display results
    resultDiv.innerHTML = `
      <h2>${country.name.common} (${region})</h2>
      <img src="${flagUrl}" alt="Flag of ${country.name.common}" />
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Temperature:</strong> ${temp}°C</p>
      <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
