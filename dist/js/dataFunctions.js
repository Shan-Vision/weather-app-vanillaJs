export const setLocationObject = (locationObj, coordsObj) => {
	const { lat, lon, name, unit } = coordsObj;
	locationObj.setLat(lat);
	locationObj.setLon(lon);
	locationObj.setName(name);
	if (unit) {
		locationObj.setUnit(unit);
	}
};

export const getHomeLocation = () => {
	return localStorage.getItem("defaultWeatherLocation");
};

export const getWeatherFromCoords = async (locationObj) => {
	const lat = locationObj.getLat();
	const lon = locationObj.getLon();
	const units = locationObj.getUnit();

	try {
		const { data } = await axios.get(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${process.env.WEATHER_API_KEY}`
		);
		return data;
	} catch (err) {
		console.error(err);
	}
};

export const getCoordsFromApi = async (entryText, units) => {
	const regex = /^\d+$/g;
	const flag = regex.test(entryText) ? "zip" : "q";
	const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${process.env.WEATHER_API_KEY}`;
	const encodedUrl = encodeURI(url);
	try {
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		console.error(err.stack);
	}
};

export const cleanText = (text) => {
	const regex = / {2,}/g;
	const entryText = text.replaceAll(regex, " ").trim();
	return entryText;
};
