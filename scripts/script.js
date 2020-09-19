const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

document.getElementById("theme-switch").addEventListener("click",() => console.log("EEEEEh, alto theme oscuro.")) ///



//1. Rellena el campo de trending topics.

setTrendingTopics(document.getElementById("trending-topics-ctn"))

async function setTrendingTopics(trendingTopicsCtn) {
    let topics = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`);
    try {
        if (topics.status!=200) throw new Error("No se pudieron cargar los trending topics");

        topics = await topics.json(); ///convierte la respuesta en json (casualmente, en una promesa).
        topics = topics.data.splice(0,5).join(", "); ///de la promesa, obtiene data, que tiene 20 términos y saca sólo 5 y después lo vuelve string.
        trendingTopicsCtn.textContent = topics;
    }
    catch(error) {
        console.log(`Trending Topics: \n${error}`);
    }
}


//2. Busca y rellena los trending GIFs.

const trendingCardsCtn = document.getElementById("trending-cards-ctn");
const trendingCardTemplate = trendingCardsCtn.children[0].content.firstElementChild;
//displayTrendingGifs(trendingCardsCtn);


async function displayTrendingGifs(trendingCardsCtn) {
    let gifs = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`);
    try {
        if (gifs.status!=200) throw new Error("No se han podido cargar los GIFs.");
        
        gifs = await gifs.json();
        gifs = gifs.data ///Ahora es un array con gifs en toda regla.
        //addTrendingGifToDOM(gifs[0]); ///
        gifs.forEach(gif => addTrendingGifToDOM(gif)); //Crea cada card y la agrega al DOM.
    }
    catch(error) {
        console.log(`Trending Gifs: \n${error}`);
    } 
}

function addTrendingGifToDOM(gif) {
    //console.log(gif);
    let ctn = trendingCardTemplate.cloneNode(true);
    //console.log(ctn)
    //console.log(gif.embed_url)
    ctn.id = gif.id; //Para tener el id del gif a mano cuando lo quiera guardar en favoritos.
    ctn.children[0].src = gif.images.fixed_height_small.url; //Setea el gif. Que para variar no se muestra >:c
    ctn.children[0].alt = gif.title;
    let gifData = gif.title.split("GIF by "); //Obtiene el título del gif y el usuario.
    ctn.children[2].children[0].textContent = gifData[1]; //Setea el usuario.
    ctn.children[2].children[1].textContent = gifData[0]; //Setea el título.
    trendingCardsCtn.appendChild(ctn);
}


//3. Funcionalidad de búsqueda 
const searchCtn = document.getElementById("search-ctn");
const searchBar = searchCtn.children[0];
const suggestionsCtn = searchCtn.children[1];

//Cambiá estos index cuando hayas arreglado el punto 3.2.a.
const searchInput = searchBar.children[1]; 
const searchButton = searchBar.children[2]; 
const clearSearchButton = searchBar.children[0];


//3.1. Predicción de búsqueda.
//a este eventListener lo podría activar en activeSearchBar, así no está ahí parado todo el día, eh.
searchInput.addEventListener("keyup",getSuggestions);

async function getSuggestions() {
    console.log(this.value)
    let terms = this.value.split(" ").join("+")
    let suggestions = await fetch(`https://api.giphy.com/v1/tags/related/${terms}?api_key=${apiKey}`)
    try {
        if (suggestions.status!=200) throw new Error("No se pudieron cargar sugerencias de búsqueda.");
        suggestions = await suggestions.json();
        if (suggestions.data.length==0) throw new Error("No se han encontrado sugerencias para la búsqueda.")
        suggestions = suggestions.data;
        if (suggestions.length>5) suggestions.splice(5,suggestions.length);
        console.log(suggestions);
        suggestions.forEach(object => addSuggestionToDOM(object.name));

    } catch (error) {
        console.log(`Search suggestions failed: ${error}`);
    }


}

//3.1. Barra, Búsqueda y display de resultados.

//a. Dar vuelta los botones. //////AAAAAGH, DO IT.
searchBar.addEventListener("click", activeSearchBar);
function activeSearchBar() {
    this.classList.add("active-search");
    console.log(this)
    searchBar.addEventListener("blur",uf); //Blur isnt the correcttttt.
}

function uf() {this.classList.remove("active-search")}
// ¿Donde pongo esto? //Acordate de ponerlo y sacar este event listener cuando ocultás el botón de nuevo.
clearSearchButton.addEventListener("click",() => searchInput.value="")

//b. Realizar búsqueda.


searchButton.addEventListener("click",makeSearch) //Buscar al apretar la lupa.

async function makeSearch() {
    let text = searchInput.value;
    text = text.split(" ").join("+");
    console.log(text)
    let results = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${text}&limit=12`);
    results = await results.json();
    try {
        if (results.message) throw new Error(results.message);
        if (results.data.lenght==0) throw new Error("No se han encontrado coincidencias con la búsqueda.")
    
        console.log(results.data)

        ////Inserte aquí su magia para agregar al DOM los gifs

    } 
    catch(error) {
        console.log(`Search failed: \n${error}`);

    }
}

//4. ¿Y ahora?





////EEEEEEPA: DETALLES
//3. En la linea 54, cuando setea el gif, también podría ser .downsized_medium.url, pesa un poco más. Pero, dato, nunca uses los still, no funcionan.
//4. Para mover el carrousel en desktop tengo que usar JS sí o sí. Y creo que va a funcionar usar: transform: translateX(-...px); (Y así hacer que se mueva.)
//5. DESTILDATE LA LINEA 30.