import attachAnimationHandler, {
    triggerHideAnimation,
    triggerShowAnimation,
} from "./landingAnimationHandler.js";
import { hideDetails } from "./locationDetailsHandler.js";
import { fetchWeather } from "./weather.js";
import buttons from "./buttons.js";

/** uiBuilder
 * Builds all the UI layers and applies them to the given parent
 *
 * @param {HTMLElement} parent
 */
export default function uiBuilder(parent) {
    applyViewHeightFix();

    buildMap(parent);
    buildLanding(parent);
    buildMapOverlay(parent);
}

/** buildLanding
 *  Creates the landing layer and applies it to the given parent
 *  The landing layer acts as the menu of the application
 *
 * @param {HTMLElement} parent
 */
export const buildLanding = async (parent) => {
    const landing = document.createElement("div");
    landing.id = "landing";

    buildLogoContainer(landing);

    await buildWeatherContainer(landing);

    buildButtonContainer(landing);

    attachAnimationHandler(landing);

    parent.appendChild(landing);
};

/** buildMap
 *  Creates the map layer and applies it to the given parent
 *
 * @param {HTMLElement} parent
 */
export const buildMap = (parent) => {
    const map = document.createElement("div");
    map.id = "map";
    // map.addEventListener('click', hideDetails);
    parent.appendChild(map);
};

/** buildMapOverlay
 *  Creates the map overlay and applies it to the given parent
 *
 * @param {HTMLElement} parent
 */
export const buildMapOverlay = (parent) => {
    const mapOverlay = document.createElement("div");
    mapOverlay.id = "mapOverlay";

    const mapDetailsContainer = document.createElement("div");
    mapDetailsContainer.id = "mapOverlayDetailsContainer";
    mapOverlay.appendChild(mapDetailsContainer);

    const mapInteractionContainer = document.createElement("div");
    mapInteractionContainer.id = "mapOverlayInteractionContainer";

    const showLandingButton = buildMenuButton();
    showLandingButton.addEventListener("click", triggerShowAnimation);
    mapInteractionContainer.appendChild(showLandingButton);

    mapOverlay.appendChild(mapInteractionContainer);

    parent.appendChild(mapOverlay);
};

/** buildWeatherContainer
 *  Creates the weather container, calls buildWeatherDetail to fill it with information then applies container to the given parent
 *
 * @param {HTMLElement} parent
 */
async function buildWeatherContainer(parent) {
    const container = document.createElement("div");
    container.classList.add("weatherContainer");

    const weatherAndNameContainer = document.createElement("div");
    weatherAndNameContainer.classList.add("weatherAndNameContainer");
    const weatherIcon = document.createElement("img");
    weatherIcon.src = "./assets/svg/weatherIcon.svg";
    weatherAndNameContainer.appendChild(weatherIcon);

    const nameElement = document.createElement("p");
    nameElement.textContent = "Oslo";
    nameElement.classList.add("weatherCityTitle");
    weatherAndNameContainer.appendChild(nameElement);
    container.appendChild(weatherAndNameContainer);

    const weather = await fetchWeather();
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("weatherInformationContainer");
    buildWeatherDetail(
        detailsContainer,
        "Temperatur",
        weather.temperature,
        "°"
    );
    buildWeatherDetail(detailsContainer, "Vind", weather.wind, "m/s");
    buildWeatherDetail(detailsContainer, "Regn", weather.rain, "mm");
    container.appendChild(detailsContainer);

    parent.appendChild(container);
}

/** buildWeatherDetail
 *  Creates weather detail with title and data based on given data then applies it to the given parent
 *
 * @param {HTMLElement} parent
 * @param {string} detailTitle
 * @param {string} detailData
 * @param {string} specialChar
 */
function buildWeatherDetail(parent, detailTitle, detailData, specialChar) {
    const container = document.createElement("div");
    container.classList.add("weatherInformationDetailContainer");

    const title = document.createElement("p");
    title.textContent = detailTitle;
    title.classList.add("weatherInformationTitle");
    container.appendChild(title);

    const detail = document.createElement("p");
    detail.textContent = detailData + specialChar;
    detail.classList.add("weatherInformationDetail");
    container.appendChild(detail);

    parent.appendChild(container);
}

/** buildLogo
 * Builds the logo logo element, fills it with a logo and applies to the given parent
 *
 * @param {HTMLElement} parent
 */
function buildLogoContainer(parent) {
    const logoElement = document.createElement("img");
    logoElement.src = "./assets/svg/logoText.svg";
    parent.appendChild(logoElement);
}

/** buildButtonElement
 * Creates the button container for the landing page
 * fills itself with button based on ./json/buttons
 *
 * @param {HTMLElement} parent
 */
async function buildButtonContainer(parent) {
    const buttElement = document.createElement("div");
    buttElement.classList.add("landButtContainer");
    //creates buttons basted on button information
    buttons.forEach((button) => {
        buttElement.addEventListener("click", triggerHideAnimation, false);
        buttElement.appendChild(buildButton(button.text, button.icon));
    });
    parent.appendChild(buttElement);
}

/** buildButton
 * Creates and return a button with text, and image if given
 *
 * @param {string} text
 * @param {string} image
 * @returns {htmlElement}
 */
function buildButton(text, image, cssClass) {
    const mainEl = document.createElement("button");
    const textEl = document.createElement("p");
    const iconEl = document.createElement("img");

    if (image) {
        iconEl.setAttribute("src", image);
        iconEl.classList.add("buttIcon");
        mainEl.appendChild(iconEl);
    }

    if (cssClass) {
        mainEl.classList.add(cssClass);
    } else {
        mainEl.classList.add("button");
    }

    textEl.textContent = text ? text : "Placeholder";
    mainEl.appendChild(textEl);

    return mainEl;
}

/** buildLocationDataDisplay
 *  Creates and return the data display for a given location
 *
 * @param {string} address
 * @param {number} avaBikes
 * @param {number} avaParks
 * @returns {htmlElement}
 */
export function buildLocationDataDisplay(address, avaBikes, avaParks) {
    const element = document.createElement("div");
    element.id = "locationDetails";

    const topContainer = document.createElement("div");
    topContainer.classList.add("locationDetailTopContainer");

    const closeDisplayElement = document.createElement("button");
    closeDisplayElement.classList.add("closeLocationDetailsButton");
    closeDisplayElement.addEventListener("click", hideDetails);
    topContainer.appendChild(closeDisplayElement);
    element.appendChild(topContainer);

    const informationContainer = document.createElement("div");
    informationContainer.classList.add("informationContainer");
    element.appendChild(informationContainer);

    const addressContainer = document.createElement("div");
    addressContainer.classList.add("locationInformationAddressContainer ");
    informationContainer.appendChild(addressContainer);

    const addressElement = document.createElement("p");
    addressElement.textContent = `${address}`;
    addressElement.classList.add("locationDetailAddress");
    addressContainer.appendChild(addressElement);

    const detailsContainer = document.createElement("div");
    informationContainer.appendChild(detailsContainer);
    detailsContainer.classList.add("detailsContainer");

    detailsContainer.appendChild(
        buildLocationDetail("./assets/svg/iconAvaBikes.svg", "Sykler", avaBikes)
    );
    detailsContainer.appendChild(
        buildLocationDetail(
            "./assets/svg/iconAvaPark.svg",
            "Parkering",
            avaParks
        )
    );

    return element;
}

/** buildLocationDetail
 *  Creates and return location detail
 *
 * @param {src} icon
 * @param {string} title
 * @param {integer} data
 * @returns
 */
function buildLocationDetail(icon, title, data) {
    const element = document.createElement("div");
    element.classList.add("detailContainer");

    const iconEl = document.createElement("img");
    iconEl.classList.add("detailIcon");
    iconEl.src = icon;

    const titleEl = document.createElement("p");
    titleEl.classList.add("detailTitle");
    titleEl.textContent = title;

    const detailEl = document.createElement("p");
    detailEl.classList.add("detailData");
    detailEl.textContent = data;

    element.appendChild(iconEl);
    element.appendChild(titleEl);
    element.appendChild(detailEl);
    return element;
}

/** buildMenuButton
 *  Creates and return menu button
 *
 * @returns {htmlElement}
 */
function buildMenuButton() {
    const element = document.createElement("div");
    element.id = "menuButton";

    const buttonIcon = document.createElement("img");
    buttonIcon.src = "./assets/svg/logoSmall.svg";

    element.appendChild(buttonIcon);

    return element;
}

/** applyViewHeightFix
 *  There are problems with vh on mobile devices, causing some elements to be hidden behind browser elements.
 *  This function fixes that.
 */
function applyViewHeightFix() {
    let vhf = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vhf}px`);
    window.addEventListener("resize", () => {
        let vhr = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vhr}px`);
    });
}
