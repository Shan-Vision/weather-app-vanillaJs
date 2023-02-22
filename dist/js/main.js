import CurrentLocation from "./CurrentLocation.js";
import { addSpinner, displayError } from "./domFunctions.js";

import { setLocationObject } from "./dataFunctions.js";
const currentLoc = new CurrentLocation();

const initApp = () => {
	// add listiners
	const geoButtons = document.getElementById("getLocation");
	geoButtons.addEventListener("click", getGeoWeather);
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