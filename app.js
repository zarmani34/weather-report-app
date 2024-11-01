const form = document.querySelector("#form");
const weatherDetails = document.querySelector(".weather-details");
const input = document.querySelector("#city-input");
const apiKey = "fa4f1798f728d7b948d4c9303dec4a5e";

class Weather {
  constructor(apiKey) {
    this._apiKey = apiKey;
  }

  set errorMessage(message) {
    const errorMssg = document.createElement("p");
    errorMssg.textContent = message;
    errorMssg.classList.add("error");

    weatherDetails.textContent = "";
    weatherDetails.style.display = "flex";
    weatherDetails.appendChild(errorMssg);
    
  }

  set city(location) {
    this._city = location;
  }

  get fetchWeatherData() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this._city}&appid=${this._apiKey}`;
    
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Couldn't fetch weather data for ${this._city}`);
        }
        return response.json(); // Returning JSON parsing as part of the fetch chain
      })
      .catch((error) => {
        throw new Error(`Error fetching weather data: ${error.message}`);
      });
  }
  

  fetchWeatherEmoji(id){
    switch(true){
        case(id >= 200 && id < 300):
            return '⛈️'
        case(id >= 300 && id < 400):
            return '🌦️'
        case(id >= 500 && id < 600):
            return '🌧️'
        case(id >= 600 && id < 700):
            return '❄️'
        case(id >= 700 && id < 800):
            return '🌫️'
        case(id === 800):
            return '☀️'
        case(id >= 801 && id < 810):
            return '☁️'
        default:
            return '❓';
    }
 }

  set appendWeatherData(data){
    
    const {name:city,
        main: {temp, humidity},
        weather:[{description, id}]
    }=data;

    weatherDetails.textContent='';
    weatherDetails.style.display='flex';

    const cityDisplay=document.createElement('h1')
    const tempDisplay=document.createElement('p')
    const humidityDisplay=document.createElement('p')
    const descDisplay=document.createElement('p')
    const weatherEmoji=document.createElement('p')

    cityDisplay.textContent=city
    tempDisplay.textContent=`${(temp-273.15).toFixed(2)}°C`
    humidityDisplay.textContent=`${humidity}% Humidity`
    descDisplay.textContent=description
    weatherEmoji.textContent= this.fetchWeatherEmoji(id)

    weatherDetails.appendChild(cityDisplay).classList.add('city')
    weatherDetails.appendChild(tempDisplay).classList.add('temp')
    weatherDetails.appendChild(humidityDisplay).classList.add('humidity')
    weatherDetails.appendChild(descDisplay).classList.add('description')
    weatherDetails.appendChild(weatherEmoji).classList.add('emoji')
  }

  async getWeatherData(){
    try{
        const data= await this.fetchWeatherData
        this.appendWeatherData=data
    }
    catch(error){
        this.errorMessage = error.message
        console.error(error)
    }
  }

}

form.addEventListener("submit",async (event) => {
  event.preventDefault();

  const city = input.value;
  const fetchWeather = new Weather(apiKey);

  if (city) {
    try {
        fetchWeather.city = city;
        await fetchWeather.getWeatherData()
    } catch (error) {
        fetchWeather.errorMessage = error
        console.error(error)
    }
  } else {
    fetchWeather.errorMessage = "Unable to fetch weather details";
  }
  input.value=''
});
