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

	h1.textContent = message;
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
		"01": "clear sky",
		"02": "few clouds",
		"03": "scattered clouds",
		"04": "broken clouds",
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
		weatherClass = "clouds";
	} else {
		weatherClass = "night";
	}
	return weatherClass;
};

const setBGImage = (weatherClass) => {
	document.documentElement.classList.add(weatherClass);
	document.documentElement.classList.forEach((img) => {
		if (img !== weatherClass) document.documentElement.classList.remove(img);
	});
};
