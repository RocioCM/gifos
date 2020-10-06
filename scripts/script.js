const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

//1. Funcionalidad de búsqueda.
const searchCtn = document.getElementById("search-ctn"); //Contenedor de la barra y las sugerencias.
const suggestionsCtn = searchCtn.children[1]; //Contenedor de todas las sugerencias.
const suggestionTemplate = suggestionsCtn.firstElementChild.content.firstElementChild; //Template para cada sugerencia.
const searchBar = searchCtn.children[0]; //Contenedor de la cruz, el input y la lupa.
const searchInput = searchBar.children[1];
const searchButton = searchBar.children[2];
const clearSearchButton = searchBar.children[0];
const searchResultsCtn = hiddenSections[1].children[1].firstElementChild; //Contenedor de los resultados de la búsqueda.


//1.1. Predicción de búsqueda (suggestions).

searchInput.addEventListener("keyup", getSuggestions);

async function getSuggestions(e) { //Busca las sugerencias para la frase en searchInput.

    if (e.key === "Enter" || e.keyCode === 13) { //Si el usuario apretó enter, lanza la búsqueda.
        makeSearch();
        return;
    };

    let terms = this.value.split(" ").join("+") //Une los términos para la búsqueda.
    ///console.log(terms)
    let suggestions = await fetch(`https://api.giphy.com/v1/tags/related/${terms}?api_key=${apiKey}&lang=es`)
    try {
        if (suggestions.status != 200) throw new Error("No se pudieron cargar sugerencias de búsqueda.");
        suggestions = await suggestions.json();
        if (suggestions.data.length == 0) throw new Error("No se han encontrado sugerencias para la búsqueda.")
        suggestions = suggestions.data; //Las sugerencias están en el array data.
        if (suggestions.length > 5) suggestions.splice(5, suggestions.length); //Me quedo sólo con 5 sugerencias.

        suggestionsCtn.innerHTML = ""; //Borra las sugerencias anteriores.
        suggestions.forEach(object => addSuggestionToDOM(object.name, suggestionTemplate));

    } catch (error) {
        suggestionsCtn.innerHTML = ""; //Borra las sugerencias anteriores.
        console.log(`Search suggestions failed: ${error}`);
    }
}

function addSuggestionToDOM(suggestion, containerTemplate) {
    let ctn = containerTemplate.cloneNode(true);
    ctn.children[1].textContent = suggestion;
    ctn.addEventListener("mousedown", () => { //Cuando se clickea una sugerencia, lanza su búsqueda.
        searchInput.value = ctn.children[1].textContent;
        makeSearch();
    });
    suggestionsCtn.appendChild(ctn);
}


//1.2. Barra, Búsqueda y display de resultados.

//a. Dar vuelta los botones. >
searchBar.addEventListener("focusin", enableSearchBar);
searchBar.addEventListener("focusout", disableSearchBar);

//b. Realizar búsqueda al apretar la lupa. >
searchButton.addEventListener("mousedown", makeSearch)

//c. Funcionalidad del botón vaciar cuadro de búsqueda.
clearSearchButton.addEventListener("mousedown", () => searchInput.value = "")



//>a. Cambia el orden de los íconos en la search-bar.
function enableSearchBar() { searchBar.classList.add("active-search") };
function disableSearchBar() {
    searchBar.classList.remove("active-search");
    suggestionsCtn.innerHTML = "";
};

//>b. Realiza la búsqueda de las palabras en searchInput.
async function makeSearch() {
    disableSearchBar();
    let text = searchInput.value; //Captura los términos a buscar.
    ///console.log("Ahora voy a buscar esto: "+text) ///
    text = text.split(" ").join("+"); //Le da el formato correcto para el fetch.
    let results = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${text}&limit=12&lang=es`);
    results = await results.json();
    try {
        if (results.message) throw new Error(results.message);
        if (results.data.lenght == 0) throw new Error("No se han encontrado coincidencias con la búsqueda.")

        const gifs = results.data;
        //console.log(hiddenSections[1]) //Es el contenedor .searched-section
        const sectionTitle = searchResultsCtn.parentNode.parentNode.firstElementChild;
        sectionTitle.textContent = searchInput.value;


        const resultsSection = hiddenSections[1];
        resultsSection.classList.remove("hidden"); //Muestra la sección de searched-gifs.

        if (gifs.length === 0) { //Muestra la sección de "No se encontraron resultados".
            resultsSection.children[1].classList.add("hidden");
            resultsSection.children[2].classList.remove("hidden");
            return;
        }
        //Muestra la galería de gifs encontrados.
        resultsSection.children[1].classList.remove("hidden");
        resultsSection.children[2].classList.add("hidden");
        if (gifs.length < 12) { resultsSection.children[1].lastElementChild.classList.add("hidden") } //Esconde el botón ver más.
        else { resultsSection.children[1].lastElementChild.classList.remove("hidden") };
        searchResultsCtn.innerHTML = "";
        gifs.forEach(gif => addGifToDOM(gif, searchResultsCtn));

    }
    catch (error) {
        console.log(`Search failed: \n${error}`);
    }
}




////EEEEEEPA: DETALLES
//3. En addTrendingGifToDOM, cuando setea el gif, también podría ser .downsized_medium.url, pesa un poco más. Pero, dato, nunca uses los still, no funcionan.
//9. Arreglar/completar event listeners de los botones en addTrendingGifToDOM.
//10. Ponerle los límites a los botones para mover el carrusel.