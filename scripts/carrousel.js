//1. Trending GIFs carrousel.

//1.a. Busca y rellena los trending GIFs.

const trendingCardsCtn = document.getElementById('trending-cards-ctn');
const trendingCardTemplate =
	trendingCardsCtn.children[0].content.firstElementChild;
displayTrendingGifs(trendingCardsCtn);

async function displayTrendingGifs(trendingCardsCtn) {
	let gifs = await fetch(
		`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`
	);
	try {
		if (gifs.status != 200)
			throw new Error('No se han podido cargar los GIFs.');

		gifs = await gifs.json();
		gifs = gifs.data; ///Ahora es un array con gifs en toda regla.
		gifs.forEach((gif) => addGifToDOM(gif, trendingCardsCtn)); //Crea cada card y la agrega al DOM.
	} catch (error) {
		console.log(`Trending Gifs: \n${error}`);
	}
}

function addGifToDOM(gif, gifsCtn) {
	let ctn = trendingCardTemplate.cloneNode(true);
	//ctn.id = gif.id; /////EEEEEh, NO PUEDO HACER ESOOOOO. Podrían repetirse. Para tener el id del gif a mano cuando lo quiera guardar en favoritos.
	ctn.children[0].src = gif.images.fixed_height_small.url; //Setea el gif.
	ctn.children[0].alt = gif.title;
	let gifData = gif.title.split('GIF by '); //Obtiene el título del gif y el usuario.
	ctn.children[2].children[0].textContent = gifData[1]; //Setea el usuario.
	ctn.children[2].children[1].textContent = gifData[0]; //Setea el título.

	//Funcionalidad de los botones:
	const btnCtn = ctn.children[1]; //Trae la botonera.
	let favorites = JSON.parse(localStorage.getItem('favGifs'));
	if (favorites.includes(gif.id)) {
		btnCtn.children[0].classList.remove("far");
		btnCtn.children[0].classList.add("fas");
	}
	btnCtn.children[0].gifId = gif.id; ///No sé si ponerlo en el botón fav o en la botonera completa.
	btnCtn.children[0].addEventListener('click', addFavorite);

	//Dependiendo del viewport, elige si ponerle el fullscreen al botón o a la imagen completa.
	//Cabe destacar que una vez que se setea al cargar la página, luego no cambia si cambia el viewport.
	//let viewPort = window.innerWidth || document.documentElement.clientWidth;
	btnCtn.children[2].addEventListener('click', displayFullScreen); //Le pone el listener al botón de fullscreen.
	ctn.children[0].addEventListener('click', displayFullScreen); //Le pone el listener a la imagen.

	btnCtn.children[1].href = gif.images.original.url;
	//btnCtn.children[1].download = gif.title

	///console.log(gif)

	gifsCtn.appendChild(ctn);
}

function addFavorite() {
	///Puede que en toda la funciónno tenga que ser this.gifId sino this.parent.gifId
	let favorites = JSON.parse(localStorage.getItem('favGifs'));
	if (!favorites.includes(this.gifId)) {
		//a. Se agrega el gif a favoritos.
		this.classList.remove("far");
		this.classList.add("fas");
		favorites.push(this.gifId);
		localStorage.setItem('favGifs', JSON.stringify(favorites));
		return;
	}
	//b. El gif ya estaba en favoritos y se elimina:
	this.classList.remove("fas");
	this.classList.add("far");
	favorites = favorites.filter((favorite) => favorite != this.gifId);
	localStorage.setItem('favGifs', JSON.stringify(favorites));
}

function displayFullScreen() {
	let gif = this.parentElement;
	if (!gif.classList.contains('gif-card')) {
		gif = gif.parentElement;
	}
	if (fullscreen.classList.contains('hidden')) {
		gif.children[1].lastElementChild.classList.remove("fa-download");
		gif.children[1].lastElementChild.classList.add("fa-times");
		fullscreen.classList.remove('hidden');
		gif.setAttribute('id', 'on-fullscreen-gif');
		return;
	}
	gif.children[1].lastElementChild.classList.remove("fa-times");
	gif.children[1].lastElementChild.classList.add("fa-download");
	fullscreen.classList.add('hidden');
	gif.setAttribute('id', '');

}

//2.a. Funcionalidad del carrusel en desktop.

const carrouselCtn = trendingCardsCtn.parentElement.parentElement;
///console.log(carrouselCtn);
carrouselCtn.firstElementChild.addEventListener('click', () =>
	console.log('move left')
);
carrouselCtn.lastElementChild.addEventListener('click', () =>
	console.log('move right')
);
