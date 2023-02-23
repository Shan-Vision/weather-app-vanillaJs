import CurrentLocation from "./CurrentLocation.js";
import { addSpinner, displayApiError, displayError, setPlaceholderText, updateScreenReaderConfirmation } from "./domFunctions.js";

import { cleanText, getCoordsFromApi, getHomeLocation, setLocationObject } from "./dataFunctions.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
	// add listiners
	const geoButtons = document.getElementById("getLocation");
	geoButtons.addEventListener("click", getGeoWeather);
	const homeButton = document.getElementById("home");
	homeButton.addEventListener("click", loadWeather);
	const saveButton = document.getElementById("saveLocation");
	saveButton.addEventListener("click", saveLocation);
	const unitButton = document.getElementById("unit");
	unitButton.addEventListener("click", setUnitPref);
	const refreshButton = document.getElementById("refresh");
	refreshButton.addEventListener("click", refreshWeather);
	const locationEntry = document.getElementById("searchBar__form");
	locationEntry.addEventListener("submit", submitNewLocation);
	// set up
	setPlaceholderText();

	// load weather
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
	if (event) {
		if (event.type === "click") {
			// add spinner
			const mapIcon = document.querySelector(".fa-map-marker-alt");
			addSpinner(mapIcon);
		}
	}
	if (!navigator.geolocation) return geoError();
	console.log("navigator", navigator);
	navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
	const errMsg = errObj ? errObj.message : "Geolocation not supported";
	displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
	const myCoordsObj = {
		lat: position.coords.latitude,
		lon: position.coords.longitude,
		name: `Lat: ${position.coords.latitude} Long: ${position.coords.longitude}`,
	};
	// set location object
	setLocationObject(currentLoc, myCoordsObj);
	// update date and display
	updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
	const savedLocation = getHomeLocation();
	if (!savedLocation && !event) return getGeoWeather();
	if (!savedLocation && event.type === "click") {
		displayError(
			"No Home Location Saved",
			"Sorry. Please save your location first."
		);
	} else if (savedLocation && !event) {
		displayHomeLocationWeather(savedLocation);
	} else {
		const homeIcon = document.querySelector(".fa-home");
		addSpinner(homeIcon);
		displayHomeLocationWeather(savedLocation);
	}
};

const displayHomeLocationWeather = (home) => {
	if (typeof home === "string") {
		const locationJson = JSON.parse(home);
		const myCoordsObj = {
			lat: locationJson.lat,
			lon: locationJson.lon,
			name: locationJson.name,
			unit: locationJson.unit,
		};
		setLocationObject(currentLoc, myCoordsObj);
		updateDataAndDisplay(currentLoc);
	}
};

const saveLocation = () => {
	if (currentLoc.getLat() && currentLoc.getLon()) {
		const saveIcon = document.querySelector(".fa-save");
		addSpinner(saveIcon);
		const location = {
			name: currentLoc.getName(),
			lat: currentLoc.getLat(),
			lon: currentLoc.getLon(),
			unit: currentLoc.getUnit(),
		};
		localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
		updateScreenReaderConfirmation(
			`Save ${currentLoc.getName()} as home location.`
		);
	}
};

const setUnitPref = () => {
	const unitIcon = document.querySelector(".fa-chart-bar");
	addSpinner(unitIcon);
	currentLoc.toogleUnit();
	updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
	const refreshIcon = document.querySelector(".fa-sync-alt");
	addSpinner(refreshIcon);
	updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
	event.preventDefault();
	const text = document.getElementById("searchBar__text").value;
	const entryText = cleanText(text);
	if (!entryText.length) return;
	const locationIcon = document.querySelector(".fa-solid");
	addSpinner(locationIcon);
	const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
	
	if (coordsData) {
		if (coordsData.cod === 200) {
			// work with api data
			// success
			const myCoordsObj = {
				lat: coordsData.coord.lat,
				lon: coordsData.coord.lon,
				name: coordsData.name,
			};
			setLocationObject(currentLoc, myCoordsObj);
			updateDataAndDisplay(currentLoc);
		} else {
			displayApiError (coordsData);
		}
	} else {
		displayError("Connection error", "Connection error");
	}
};

const updateDataAndDisplay = async (locationObj) => {
	// const weatherJson = await getWeatherFromCoords(locationObj);
	// if (weatherJson) updateDisplay(weatherJson, locationObj);
};
