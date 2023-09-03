// VARIÁVEIS E SELEÇÃO DE ELEMENTOS
const apiKey = "cd26fae378d0ec355ff032aba043963c";
// url para as bandeiras
const apiCountryURL = "https://flagsapi.com/";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

// seleção de elementos para preencher os dados
const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data")

// FUNÇÕES
// async porque, por ser uma api, pode demorar um tempo para responder
const getWeatherData = async (city) => {
    // q=${city} == pegando os dados da cidade especificado pelo input
    // units=metric == unidade de medida
    // lang == buscar os dados em pt_br
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`

    const res = await fetch(apiWeatherURL);
    const data = await res.json();

    // retornando os dados aqui...
    return data;
};

// como acima é async, aqui precisa ser também
const showWeatherData = async (city) => {
    // ...podemos pegá-los aqui
    const data = await getWeatherData(city);


    // trocar os dados:

    // nome da cidade
    cityElement.innerText = data.name;
    // temperatura (valor inteiro)
    tempElement.innerText = parseInt(data.main.temp);
    // descrição do tempo (ensolarado, nublado, etc.)
    descElement.innerText = data.weather[0].description;
    // muda o atributo chamado "src" / string dinâmica
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    // muda a bandeira
    countryElement.setAttribute("src", apiCountryURL + data.sys.country + "/shiny/64.png");
    // muda a umidade
    humidityElement.innerText = `${data.main.humidity}`;
    // muda a velocidade do vento
    windElement.innerText = `${data.wind.speed}`;

    // remoção da classe "hide" quando pesquisar algo
    weatherContainer.classList.remove("hide");
};

// EVENTOS

// (e) == função anônima pegando o argumento do evento
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const city = cityInput.value;

    // esse evento vai enviar o valor escrito na barra de pesquisas para a função de mesmo nome
    showWeatherData(city);
});

// pesquisar clicando na tecla "enter"
cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        // pega o valor de "city"...
        const city = e.target.value;

        // ...e aciona o "showWeatherData" usando o valor de "city"
        showWeatherData(city);
    }
})