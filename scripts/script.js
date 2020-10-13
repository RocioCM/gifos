
//1. Funcionalidad de búsqueda.
const searchCtn = document.getElementById("search-ctn"); //Contenedor de la barra y las sugerencias.
const suggestionsCtn = searchCtn.children[1]; //Contenedor de todas las sugerencias.
const suggestionTemplate = suggestionsCtn.firstElementChild.content.firstElementChild; //Template para cada sugerencia.
const searchBar = searchCtn.children[0]; //Contenedor de la cruz, el input y la lupa.
const searchInput = searchBar.children[1];
const searchButton = searchBar.children[2];
const clearSearchButton = searchBar.children[0];
const searchResultsCtn = hiddenSections[1].children[1].firstElementChild; //Contenedor de los resultados de la búsqueda.
const searchMoreBtn = searchResultsCtn.nextElementSibling; //Botón de 'Ver más'.
const searchResultsTitle = searchResultsCtn.parentNode.previousElementSibling;



//1.1. Predicción de búsqueda (suggestions).

searchInput.addEventListener("keyup", getSuggestions);

async function getSuggestions(e) { //Busca las sugerencias para la frase en searchInput.

    if (e.key === "Enter" || e.keyCode === 13) { //Si el usuario apretó enter, lanza la búsqueda.
        makeSearch();
        return;
    };

    let terms = this.value.split(" ").join("+") //Une los términos para la búsqueda.

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

//a. Acomodar los botones cuando se activa la barra de búsqueda. >
searchBar.addEventListener("focusin", enableSearchBar);
searchBar.addEventListener("focusout", disableSearchBar);

//b. Realizar búsqueda al apretar la lupa. >
searchButton.addEventListener("mousedown", makeSearch);

//c. Vaciar cuadro de búsqueda al apretar la cruz.
clearSearchButton.addEventListener("mousedown", () => searchInput.value = "");

//d. Funcionalidad del botón 'Ver más'. >
searchMoreBtn.addEventListener("click", addSearchResults);


//>a. Cambia el orden de los íconos en la search-bar.
function enableSearchBar() { searchBar.classList.add("active-search") };
function disableSearchBar() {
    searchBar.classList.remove("active-search");
    suggestionsCtn.innerHTML = "";
};

//>b. Realiza la búsqueda de las palabras en searchInput.
let searchShownPages = 0; //Contador de las veces que se presionó el botón 'Ver Más'
function makeSearch() {
    searchShownPages = 0; //Borra el estado de la búsqueda previa,
    disableSearchBar();
    searchResultsTitle.textContent = searchInput.value;
    addSearchResults(); //Muestra en la galería hasta 12 resultados de búsqueda.
}


//>d. Carga resultados de búsqueda. Llamado desde makeSearch() o al presionar el botón 'Ver más'.
async function addSearchResults() {

    let text = searchResultsTitle.textContent;
    text = text.split(" ").join("+"); //Le da el formato correcto para el fetch.

    let results = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${text}&offset=${searchShownPages * 12}&limit=12&lang=es`);
    results = await results.json();
    try {
        if (results.message) throw new Error(results.message);

        const gifs = results.data;

        if (searchShownPages === 0) { //Sets sólo si carga los resultados por primera vez (invocado desde makeSearch).
            const resultsSection = hiddenSections[1];
            resultsSection.classList.remove("hidden"); //Muestra la sección de searched-gifs.

            if (gifs.length === 0) { //Muestra la sección de "No se encontraron resultados".
                resultsSection.children[1].classList.add("hidden");
                resultsSection.children[2].classList.remove("hidden");
                return;
            }
            //Muestra la galería de resultados.
            resultsSection.children[1].classList.remove("hidden");
            resultsSection.children[2].classList.add("hidden");
            searchResultsCtn.innerHTML = "";
            if (gifs.length === 12) searchMoreBtn.classList.remove("hidden");
        }

        if (gifs.length < 12) searchMoreBtn.classList.add("hidden");

        gifs.forEach(gif => addGifToDOM(gif, searchResultsCtn, false));

    } catch (error) {
        console.log(`Search failed: \n${error}`);
    }

    searchShownPages++; //Para el correcto funcionamiento del botón 'Ver más'.
}




////EEEEEEPA: DETALLES
//3. En addGifToDOM, cuando setea el gif, también podría ser .downsized_medium.url, pesa un poco más. Pero, dato, nunca uses los still, no funcionan.
//10. Hacer la compatibilidad del carrousel scroll entre mobile y desktop. Nah.
//Capaz te sirva: https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

//Re-modularize: only script and trendings.

///CREATE-GIFO PENDIENTE:
//4.Estilos mobile-friendly. Nah.
//6. Poner pantalla de error cuando el gif no se pudo subir. Y reintentar. Y cuando no se pudo obtener acceso a la cámara.

//Cómodo HTML:
// <!-- <i class="fas fa-check"></i>
//     <i class="fas fa-spinner"></i>-->

//COMMENTS CSS:
// #search-ctn {  ///Solo se mantiene en sticky hasta llegar al aside. Más info en wpp.
//     position: sticky;
//     top: 2vh;
//     z-index: 10;
// }
/*
COMMENTS CSS:
2. Fijate si hay cosas para eliminar/emprolijar en los estilos de #on-fullscreen-gif.
3. Sobre el fullscreen y la proporción: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit .
4. Otro más sobre el fullscreen y la proporción: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale.
*/