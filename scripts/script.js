const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";



//1. Busca y rellena los trending GIFs.

const trendingCardsCtn = document.getElementById("trending-cards-ctn");
const trendingCardTemplate = trendingCardsCtn.children[0].content.firstElementChild;
//displayTrendingGifs(trendingCardsCtn);


async function displayTrendingGifs(trendingCardsCtn) {
    let gifs = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`);
    try {
        if (gifs.status!=200) throw new Error("No se han podido cargar los GIFs.");
        
        gifs = await gifs.json();
        gifs = gifs.data ///Ahora es un array con gifs en toda regla.
        gifs.forEach(gif => addTrendingGifToDOM(gif)); //Crea cada card y la agrega al DOM.
    }
    catch(error) {
        console.log(`Trending Gifs: \n${error}`);
    } 
}

function addTrendingGifToDOM(gif) {
    let ctn = trendingCardTemplate.cloneNode(true);
    ctn.id = gif.id; //Para tener el id del gif a mano cuando lo quiera guardar en favoritos.
    ctn.children[0].src = gif.images.fixed_height_small.url; //Setea el gif. Que para variar no se muestra >:c
    ctn.children[0].alt = gif.title;
    let gifData = gif.title.split("GIF by "); //Obtiene el título del gif y el usuario.
    ctn.children[2].children[0].textContent = gifData[1]; //Setea el usuario.
    ctn.children[2].children[1].textContent = gifData[0]; //Setea el título.
    trendingCardsCtn.appendChild(ctn);
}


//2. Funcionalidad de búsqueda.
const searchCtn = document.getElementById("search-ctn"); //Contenedor de la barra y las sugerencias.
const suggestionsCtn = searchCtn.children[1]; //Contenedor de todas las sugerencias.
const suggestionTemplate = suggestionsCtn.firstElementChild.content.firstElementChild; //Template para cada sugerencia.
const searchBar = searchCtn.children[0]; //Contenedor de la cruz, el input y la lupa.
const searchInput = searchBar.children[1]; 
const searchButton = searchBar.children[2]; 
const clearSearchButton = searchBar.children[0];


//2.1. Predicción de búsqueda (suggestions).

searchInput.addEventListener("input",getSuggestions); 

async function getSuggestions() { //Busca las sugerencias para la frase en searchInput.
    console.log(this.value) ///

    let terms = this.value.split(" ").join("+") //Une los términos para la búsqueda.
    let suggestions = await fetch(`https://api.giphy.com/v1/tags/related/${terms}?api_key=${apiKey}`)
    try {

        if (suggestions.status!=200) throw new Error("No se pudieron cargar sugerencias de búsqueda.");
        suggestions = await suggestions.json();
        if (suggestions.data.length==0) throw new Error("No se han encontrado sugerencias para la búsqueda.")
        suggestions = suggestions.data; //Las sugerencias están en el array data.
        if (suggestions.length>5) suggestions.splice(5,suggestions.length); //Me quedo sólo con 5 sugerencias.
        
        suggestionsCtn.classList.remove("hidden") //Si sugerencias-ctn todavía está oculto, lo muestra.
        suggestionsCtn.innerHTML = ""; //Borra las sugerencias anteriores.
        suggestions.forEach(object => addSuggestionToDOM(object.name, suggestionTemplate));

    } catch (error) {
        suggestionsCtn.innerHTML = ""; //Borra las sugerencias anteriores.
        suggestionsCtn.classList.add("hidden"); //Esconde el contenedor de sugerencias, ya que está vacío.
        console.log(`Search suggestions failed: ${error}`);
    }
}

function addSuggestionToDOM(suggestion, containerTemplate) {
    let ctn = containerTemplate.cloneNode(true);
    ctn.children[1].textContent = suggestion;
    ctn.addEventListener("mousedown",()=> { //Cuando se clickea una sugerencia, lanza su búsqueda.
        searchInput.value = ctn.children[1].textContent; 
        makeSearch();
    });
    suggestionsCtn.appendChild(ctn);
}


//2.2. Barra, Búsqueda y display de resultados.

//a. Dar vuelta los botones. >
searchBar.addEventListener("focusin", enableSearchBar);
searchBar.addEventListener("focusout",disableSearchBar); 

//b. Realizar búsqueda al apretar la lupa. >
searchButton.addEventListener("click",makeSearch) 

//c. Funcionalidad del botón vaciar cuadro de búsqueda.
clearSearchButton.addEventListener("mousedown",() => searchInput.value="")



//>a. Cambia el orden de los íconos en la search-bar.
function enableSearchBar() {searchBar.classList.add("active-search")};
function disableSearchBar() {
    searchBar.classList.remove("active-search");
    suggestionsCtn.classList.add("hidden");
};

//>b. Realiza la búsqueda de las palabras en searchInput.
async function makeSearch() {
    let text = searchInput.value; //Captura los términos a buscar.
    text = text.split(" ").join("+"); //Le da el formato correcto para el fetch.
    console.log("Ahora voy a buscar esto: "+text) ///
    let results = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${text}&limit=12`);
    results = await results.json();
    try {
        if (results.message) throw new Error(results.message);
        if (results.data.lenght==0) throw new Error("No se han encontrado coincidencias con la búsqueda.")
    
        console.log(results.data) ///

        ////Inserte aquí su magia para agregar al DOM los gifs
        //
        //
        //
    } 
    catch(error) {
        console.log(`Search failed: \n${error}`);
    }
}







//1. Rellena el campo de trending topics. 

setTrendingTopics(document.getElementById("trending-topics-ctn"))

async function setTrendingTopics(trendingTopicsCtn) {
    let topics = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`);
    try {
        if (topics.status!=200) throw new Error("No se pudieron cargar los trending topics");

        topics = await topics.json(); ///convierte la respuesta en json (casualmente, en una promesa).
        topics = topics.data.splice(0,5); ///de la promesa, obtiene data, que tiene 20 términos y saca sólo 5.
        topics.forEach(topic => addTrendingTopic(topic, trendingTopicsCtn)); //agrega al DOM todos cada topic.
    }
    catch(error) {
        console.log(`Trending Topics: \n${error}`);
    }
}

function addTrendingTopic(topic, topicsCtn) { //Agrega un topic al DOM y le pone un Listener para lanzar el search cuando se lo clickea.
    let ctn = document.createElement("span");
    ctn.textContent = `${topic}, `; 
    ctn.addEventListener("click", ()=> console.log(ctn.textContent) /*{searchInput.value = ctn.textContent; makeSearch()}*/);
    topicsCtn.appendChild(ctn);
}













////EEEEEEPA: DETALLES
///document.getElementById("theme-switch").addEventListener("click",() => console.log("EEEEEh, alto theme oscuro.")) ///
//3. En addTrendingGifToDOM, cuando setea el gif, también podría ser .downsized_medium.url, pesa un poco más. Pero, dato, nunca uses los still, no funcionan.
//4. Para mover el carrousel en desktop tengo que usar JS sí o sí. Y creo que va a funcionar usar: transform: translateX(-...px); (Y así hacer que se mueva.)
//5. DESTILDATE LA LINEA QUE LLAMA AL CARROUSEL "displayTrendingGifs(...)".
//7. Arreglar el tema de las comitas en los Trending Topics. (Y descomentar lo del EventListener y sacar el console.log).
//8. Implementá la búsqueda en la función search.