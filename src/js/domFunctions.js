export const setPlaceholderText = () => {
	const input = document.getElementById("searchBar__text");

	window.innerWidth < 400
		? (input.placeholder = "City, State, Country")
		: (input.placeholder = "City, State, Country or Zip Code");
};

export const addSpinner = (element) => {
	animateButton(element);
	setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
	element.classList.toggle("none");
	element.nextElementSibling.classList.toggle("block");
	element.nextElementSibling.classList.toggle("none");
};

const updateWeatherLocationHeader = (message) => {
	const h1 = document.getElementById("currentForecast__location");

	if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) {
		const msgArray = message.split(" ");
		const mapArray = msgArray.map((msg) => {
			if (msg.includes(":")) {
				return msg.replace(":", ":  ");
			}
			return msg;
		});

		const lat =
			mapArray[0].indexOf("-") === -1
				? mapArray[1].slice(0, 5)
				: mapArray[1].slice(0, 10);

		const lon =
			mapArray[0].indexOf("-") === -1
				? mapArray[3].slice(0, 5)
				: mapArray[3].slice(0, 5);
		h1.textContent = `${mapArray[0]}${lat} • ${mapArray[2]}${lon}`;
	} else {
		h1.textContent = message;
	}
};

export const updateScreenReaderConfirmation = (message) => {
	document.getElementById("confirmation").textContent = message;
};

// helper functions
export const displayError = (headerMsg, srMsg) => {
	updateWeatherLocationHeader(headerMsg);
	updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
	const properMsg = toProperCase(statusCode.message);
	updateWeatherLocationHeader(properMsg);
	updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
	const words = text.split(" ");
	const properWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return properWords.join(" ");
};

// interface updating function
export const updateDisplay = (weatherJson, locationObj) => {
	fadeDisplay();
	clearDisplay();
	const weatherClass = getWeatherClass(weatherJson.current.weather[0].icon);
	setBGImage(weatherClass);
	const screenReaderWeather = buildScreenReaderWeather(weatherJson, locationObj);
	updateScreenReaderConfirmation(screenReaderWeather);
	updateWeatherLocationHeader(locationObj.getName());
	// current conditions
	const ccArray = createCurrentConditionsDivs(
		weatherJson,
		locationObj.getUnit()
	);
	displayCurrentConditions(ccArray);
	// six day forecast
	displaySixDayForecast(weatherJson);
	setFocusOnSearch();
	fadeDisplay();
};

const fadeDisplay = () => {
	const cc = document.getElementById("currentForecast");
	cc.classList.toggle("zero-vis");
	cc.classList.toggle("fade-in");
	const sixDay = document.getElementById("dailyForecast");
	sixDay.classList.toggle("zero-vis");
	sixDay.classList.toggle("fade-in");
};

const clearDisplay = () => {
	const currentConditions = document.getElementById(
		"currentForecast__conditions"
	);
	deleteContents(currentConditions);
	const sixDayForecast = document.getElementById("dailyForecast__contents");
	deleteContents(sixDayForecast);
};

const deleteContents = (parentElement) => {
	let child = parentElement.lastElementChild;
	while (child) {
		parentElement.removeChild(child);
		child = parentElement.lastElementChild;
	}
};

const getWeatherClass = (icon) => {
	const firstTwoChars = icon.slice(0, 2);
	const lastChar = icon.slice(2);
	const weatherLookup = {
		"01": "clear-sky",
		"02": "few-clouds",
		"03": "scattered-clouds",
		"04": "scattered-clouds",
		"09": "snow",
		10: "rain",
		11: "thunderstorm",
		13: "snow",
		50: "fog",
	};
	let weatherClass;
	if (weatherLookup[firstTwoChars]) {
		weatherClass = weatherLookup[firstTwoChars];
	} else if (lastChar === "d") {
		weatherClass = "thunderstorm";
	} else {
		weatherClass = "night";
	}
	return weatherClass;
};

const setBGImage = (weatherClass) => {
	const source = {
		imageUrl:
			weatherClass === "clear-sky"
				? "../img/clear-sky.jpg"
				: weatherClass === "few-clouds"
				? "../img/clouds.jpg"
				: weatherClass === "rain"
				? "../img/rain.jpg"
				: weatherClass === "snow"
				? "../img/snow.jpg"
				: weatherClass === "scattered-clouds"
				? "../img/scattered-clouds.jpg"
				: weatherClass === "scattered-clouds"
				? "../img/scattered-clouds.jpg"
				: weatherClass === "thunderstorm"
				? "../img/thunderstorm.jpg"
				: "../img/clouds.jpg",
	};
	document.documentElement.style.backgroundImage = `url(${source.imageUrl})`;
};

const buildScreenReaderWeather = (weatherJson, locationObj) => {
	const location = locationObj.getName();
	const unit = locationObj.getUnit();
	const tempUnit = unit === "imperial" ? "C" : "F";
	return `${
		weatherJson.current.weather[0].description
	} and ${convertFahrenheitToCelsius(
		weatherJson.current.temp
	)}°${tempUnit} in ${location}`;
};

function convertFahrenheitToCelsius(fahrenheit) {
	const convertedTemp = ((fahrenheit - 32) * 5) / 9;
	const celsius = Math.round(Number(convertedTemp));
	return celsius;
}

const setFocusOnSearch = () => {
	document.getElementById("searchBar__text").focus();
};

const createCurrentConditionsDivs = (weatherObj, unit) => {
	const tempUnit = unit === "imperial" ? "C" : "F";
	const windUnit = unit === "imperial " ? "mph" : "m/s";
	const icon = createMainImageDiv(
		weatherObj.current.weather[0].icon,
		weatherObj.current.weather[0].description
	);
	const temp = createElem(
		"div",
		"temp",
		`${convertFahrenheitToCelsius(weatherObj.current.temp)}° `,
		tempUnit
	);
	const properDesc = toProperCase(weatherObj.current.weather[0].description);
	const desc = createElem("div", "desc", properDesc);
	const feels = createElem(
		"div",
		"feels",
		`Feels Like ${convertFahrenheitToCelsius(weatherObj.current.feels_like)}°`
	);
	const maxTemp = createElem(
		"div",
		"maxtemp",
		`High ${convertFahrenheitToCelsius(weatherObj.daily[0].temp.max)}°`
	);
	const minTemp = createElem(
		"div",
		"mintemp",
		`Low ${convertFahrenheitToCelsius(weatherObj.daily[0].temp.min)}°`
	);
	const humidity = createElem(
		"div",
		"humidity",
		`Humidity ${weatherObj.current.humidity}%`
	);
	const wind = createElem(
		"div",
		"wind",
		`Wind ${Math.round(Number(weatherObj.current.wind_speed))} ${windUnit}`
	);
	return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
};

const createMainImageDiv = (icon, altText) => {
	const iconDiv = createElem("div", "icon");
	iconDiv.id = "icon";
	const faIcon = translateIconToFontAwesome(icon);
	faIcon.ariaHidden = true;
	faIcon.title = altText;
	iconDiv.appendChild(faIcon);
	return iconDiv;
};

const createElem = (elemType, divClassName, divText, unit) => {
	const div = document.createElement(elemType);
	div.className = divClassName;
	if (divText) {
		div.textContent = divText;
	}
	if (divClassName === "temp") {
		const unitDiv = document.createElement("div");
		unitDiv.className = "unit";
		unitDiv.textContent = unit;
		div.appendChild(unitDiv);
	}
	return div;
};

const translateIconToFontAwesome = (icon) => {
	const i = document.createElement("i");
	const firstTwoChars = icon.slice(0, 2);
	const lastChar = icon.slice(2);
	switch (firstTwoChars) {
		case "01":
			if (lastChar === "d") {
				i.classList.add("far", "fa-sun");
			} else {
				i.classList.add("far", "fa-moon");
			}
			break;
		case "02":
			if (lastChar === "d") {
				i.classList.add("fas", "fa-cloud-sun");
			} else {
				i.classList.add("fas", "fa-cloud-moon");
			}
			break;
		case "03":
			i.classList.add("fas", "fa-cloud");
			break;
		case "04":
			i.classList.add("fas", "fa-cloud-meatball");
			break;
		case "09":
			i.classList.add("fas", "fa-cloud-rain");
			break;
		case "10":
			if (lastChar === "d") {
				i.classList.add("fas", "fa-cloud-sun-rain");
			} else {
				i.classList.add("far", "fa-moon-rain");
			}
			break;
		case "11":
			i.classList.add("fas", "fa-poo-storm");
			break;
		case "13":
			i.classList.add("fas", "fa-snowflake");
			break;
		case "50":
			i.classList.add("fas", "fa-smog");
			break;
		default:
			i.classList.add("far", "fa-question-circle");
	}
	return i;
};

const displayCurrentConditions = (currentConditionsArray) => {
	const ccContainer = document.getElementById("currentForecast__conditions");
	currentConditionsArray.forEach((cc) => {
		ccContainer.appendChild(cc);
	});
};

const displaySixDayForecast = (weatherJson) => {
	for (let i = 1; i <= 6; i++) {
		const dfArray = createDailyForecastDivs(weatherJson.daily[i]);
		displayDailyForecast(dfArray);
	}
};

const createDailyForecastDivs = (dayWeather) => {
	const dayAbbreviationText = getDayAbbreviation(dayWeather.dt);
	const dayAbbreviation = createElem(
		"p",
		"dayAbbreviation",
		dayAbbreviationText
	);
	const dayIcon = createDailyForecastIcon(
		dayWeather.weather[0].icon,
		dayWeather.weather[0].description
	);
	const dayHigh = createElem(
		"p",
		"dayHigh",
		`${convertFahrenheitToCelsius(dayWeather.temp.max)}°`
	);
	const dayLow = createElem(
		"p",
		"dayLow",
		`${convertFahrenheitToCelsius(dayWeather.temp.min)}`
	);

	return [dayAbbreviation, dayIcon, dayHigh, dayLow];
};

const getDayAbbreviation = (data) => {
	const dataObj = new Date(data * 1000);
	const utcString = dataObj.toUTCString();
	return utcString.slice(0, 3).toUpperCase();
};

const createDailyForecastIcon = (icon, altText) => {
	const img = document.createElement("img");
	if (window.innerWidth < 768 || window.innerHeight < 1025) {
		img.src = `https://openweathermap.org/img/wn/${icon}.png`;
	} else {
		img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}
	img.alt = altText;
	return img;
};

const displayDailyForecast = (dfArray) => {
	const dayDiv = createElem("div", "forecastDay");
	dfArray.forEach((el) => {
		dayDiv.appendChild(el);
	});
	const dailyForecastContainer = document.getElementById(
		"dailyForecast__contents"
	);
	dailyForecastContainer.appendChild(dayDiv);
};

window.setBGImage = setBGImage;






