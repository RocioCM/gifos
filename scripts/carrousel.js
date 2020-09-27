//1. Trending GIFs carrousel.

//1.a. Busca y rellena los trending GIFs.

const trendingCardsCtn = document.getElementById("trending-cards-ctn");
const trendingCardTemplate = trendingCardsCtn.children[0].content.firstElementChild;
displayTrendingGifs(trendingCardsCtn);


async function displayTrendingGifs(trendingCardsCtn) {
    let gifs = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`);
    try {
        if (gifs.status!=200) throw new Error("No se han podido cargar los GIFs.");
        
        gifs = await gifs.json();
        gifs = gifs.data ///Ahora es un array con gifs en toda regla.
        gifs.forEach(gif => addGifToDOM(gif,trendingCardsCtn)); //Crea cada card y la agrega al DOM.
    }
    catch(error) {
        console.log(`Trending Gifs: \n${error}`);
    } 
}

function addGifToDOM(gif, gifsCtn) {
    let ctn = trendingCardTemplate.cloneNode(true);
    //ctn.id = gif.id; /////EEEEEh, NO PUEDO HACER ESOOOOO. Podrían repetirse. Para tener el id del gif a mano cuando lo quiera guardar en favoritos.
    ctn.children[0].src = gif.images.fixed_height_small.url; //Setea el gif.
    ctn.children[0].alt = gif.title;
    let gifData = gif.title.split("GIF by "); //Obtiene el título del gif y el usuario.
    ctn.children[2].children[0].textContent = gifData[1]; //Setea el usuario.
    ctn.children[2].children[1].textContent = gifData[0]; //Setea el título.
    
    //Funcionalidad de los botones:
    const btnCtn = ctn.children[1]; //Trae la botonera.
    let favorites = JSON.parse(localStorage.getItem("favGifs"));
    if (favorites.includes(gif.id)) btnCtn.children[0].src = "../images/icon-trash-hover.svg";
    
    btnCtn.children[0].gifId = gif.id; ///No sé si ponerlo en el botón fav o en la botonera completa.
    btnCtn.children[0].addEventListener("click",addFavorite);
    btnCtn.children[2].addEventListener("click",displayFullScreen);
    
    btnCtn.children[1].href = gif.images.original.url;
    //btnCtn.children[1].download = gif.title

    ///console.log(gif)

    gifsCtn.appendChild(ctn);
}


function addFavorite() { ///Puede que en toda la funciónno tenga que ser this.gifId sino this.parent.gifId
    let favorites = JSON.parse(localStorage.getItem("favGifs"));
    if (!favorites.includes(this.gifId)) { //a. Se agrega el gif a favoritos.
        this.src = "../images/icon-trash-hover.svg";///Conseguite el ícono posta.
        favorites.push(this.gifId)
        localStorage.setItem("favGifs",JSON.stringify(favorites));
        return
    }
    //b. El gif ya estaba en favoritos y se elimina:
    this.src = "../images/icon-fav-hover.svg";///Conseguite el ícono posta.
    favorites = favorites.filter(favorite => favorite!=this.gifId)
    localStorage.setItem("favGifs",JSON.stringify(favorites));
}

function displayFullScreen() {
    console.log("Mostrar en fullscreen")
}
 
//2.a. Funcionalidad del carrusel en desktop.

const carrouselCtn = trendingCardsCtn.parentElement.parentElement;
///console.log(carrouselCtn);
carrouselCtn.firstElementChild.addEventListener("click",()=> console.log("move left"));
carrouselCtn.lastElementChild.addEventListener("click",()=> console.log("move right"));