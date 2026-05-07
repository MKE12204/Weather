import condition from "./condition.js";

let apiKey = "d0086b90d3024ca28c0112408260305";
const getHeader = document.querySelector("header")
const getForm = document.querySelector("form");
const getInput = document.querySelector("input");


function removeCard(){
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
};

function showError(){
    getHeader.insertAdjacentHTML('afterend', '<div class="card">City is not defined</div>');
};

function showCard (name,country,temp,icon,text) {
        const html = `
            <div class="card">
                <div class="card-city">${name} <span>${country}</span></div>
                <div class="card-weather">
                    <div class="card-value">${temp}<sup>°C</sup></div>
                    <img src="https:${icon}" alt="Weather">
                </div>
                <div class="card-desc">${text}</div> 
            </div>`;
        
        getHeader.insertAdjacentHTML('afterend', html);
};

async function getWeather (city){
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    if (!response.ok) {
            throw new Error('City is not defined');
    }
    const data = await response.json();
    return data;
};

const languageDetector = {
    ru: /[а-яё]/i,         // Кириллица
    uk: /[ґєії]/i,         // Украинский
    pl: /[ąćęłńóśźż]/i,     // Польский
    ar: /[\u0600-\u06FF]/, // Арабский 
    zh: /[\u4e00-\u9fa5]/, // Китайский
    ja: /[\u3040-\u30ff]/  // Японский
};  

getForm.onsubmit = async function(e) {
    e.preventDefault();
    let city = getInput.value.trim();
    if (!city) return; 
    let lang = 'en'
    for(let key in languageDetector){
        if(languageDetector[key].test(city)){
            lang = key;
            break;
        }
    }

    getInput.value = "";

    removeCard();
    try {
        const data = await getWeather(city); 
        const info = condition.find(obj => obj.code === data.current.condition.code);
        let weatherText = data.current.condition.text;
        if (info) {
            const translation = info.languages.find(l => l.lang_iso === lang);
            
            if (translation) {
                weatherText = data.current.is_day ? translation.day_text : translation.night_text;
            }
        }
        showCard(data.location.name,
            data.location.country,
            data.current.temp_c,
            data.current.condition.icon,
            weatherText);
    }catch {
        showError();
    }; 
}



