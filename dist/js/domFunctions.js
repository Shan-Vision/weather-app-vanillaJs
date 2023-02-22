export const addSpinner = (element) => {
	animateButton(element);
	setTimeout(animateButton, 1000, element);
};

const animateButton = (element) => {
	element.classList.toggle("none");
	element.nextElementSibling.classList.toggle("block");
	element.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
	updateWeatherLocationHeader(headerMsg);
	updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
	const properMsg = toProperCase(statusCode.message);
	updateWeatherLocationHeader(properMsg);
	updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};