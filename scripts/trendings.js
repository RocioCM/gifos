//TRENDING TOPICS + TRENDING GIFS + ADDGIFCARDTODOM


//1. Rellena el campo de trending topics. 

setTrendingTopics(document.getElementById("trending-topics-ctn"))

async function setTrendingTopics(trendingTopicsCtn) {
	let topics = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`);
	try {
		if (topics.status != 200) throw new Error("No se pudieron cargar los trending topics");

		topics = await topics.json();
		const topicsList = topics.data.splice(0, 5); //De la promesa, obtiene data, que tiene 20 términos y saca sólo 5.
		topicsList.forEach((topic, index) => addTrendingTopic(topic, trendingTopicsCtn, index)); //Agrega al DOM todos cada topic.
	}
	catch (error) {
		console.log(`Trending Topics: \n${error}`);
	}
}

function addTrendingTopic(topic, topicsCtn, index) {
	//Agrega un topic al DOM y le pone un Listener para lanzar el search cuando se lo clickea.

	let ctn = document.createElement("span");
	ctn.textContent = topic;

	ctn.textContent += (index !== 4) ? ", " : "  ";

	ctn.addEventListener("click", () => {
		searchInput.value = ctn.textContent.slice(0, -2); //Lo busca sin la coma.
		makeSearch()
	}
	);
	topicsCtn.appendChild(ctn); //Agrega la palabra al párrafo en el DOM.
}






//1. Trending GIFs carrousel.

//1.a. Busca y rellena los trending GIFs.

const trendingCardsCtn = document.getElementById("trending-cards-ctn");
const gifCardTemplate =
	trendingCardsCtn.children[0].content.firstElementChild;
displayTrendingGifs(trendingCardsCtn);

async function displayTrendingGifs(trendingCardsCtn) {
	let gifs = await fetch(
		`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`
	);
	try {
		if (gifs.status != 200)
			throw new Error("No se han podido cargar los GIFs.");

		gifs = await gifs.json();
		gifs = gifs.data; ///Ahora es un array con gifs en toda regla.
		gifs.forEach((gif) => addGifToDOM(gif, trendingCardsCtn, false)); //Crea cada card y la agrega al DOM.
	} catch (error) {
		console.log(`Trending Gifs: \n${error}`);
	}
}

function addGifToDOM(gif, gifsCtn, isMyGifo) {
	console.log(gif);
	const ctn = gifCardTemplate.cloneNode(true);

	ctn.children[0].src = gif.images.fixed_height_small.url; //Setea el gif.
	ctn.children[0].alt = gif.title;

	const gifData = gif.title.split("GIF by "); //Obtiene el título del gif y el usuario.
	const gifCardInfo = ctn.children[1];
	gifCardInfo.children[1].children[0].textContent = gifData[1]; //Setea el usuario.
	gifCardInfo.children[1].children[1].textContent = gifData[0]; //Setea el título.

	//Funcionalidad de los botones:
	const btnCtn = gifCardInfo.children[0]; //Trae la botonera.

	//a. Funcionalidad de favorito / borrar de mis gifos (depende del container).
	const firstBtn = btnCtn.children[0];
	firstBtn.gifId = gif.id;

	if (!isMyGifo) { //El primer botón permitirá agregar/borrar favorito.
		const favorites = JSON.parse(localStorage.getItem("favGifs"));
		if (favorites.includes(gif.id)) {
			firstBtn.classList.remove("far");
			firstBtn.classList.add("fas");
		}
		firstBtn.addEventListener("click", addFavorite);
	} else { //El primer botón permitirá eliminar un gif de "Mis gifos".
		firstBtn.classList.remove("fa-heart");
		firstBtn.classList.add("fa-trash-alt");
		firstBtn.addEventListener("click", deleteMyGifo);
	}

	//b. Funcionalidad de descarga.
	const downloadBtn = btnCtn.children[1];
	downloadBtn.dataset.gifUrl = gif.images.original.url;
	downloadBtn.dataset.title = gif.title;
	downloadBtn.addEventListener("click", downloadGif);

	//c. Funcionalidad de fullscreen.
	btnCtn.children[2].addEventListener("click", displayFullScreen); //Le pone el listener al botón de fullscreen. (desktop)
	ctn.children[0].addEventListener("click", displayFullScreen); //Le pone el listener a la imagen. (mobile)

	gifsCtn.appendChild(ctn);
}

function addFavorite() {
	///Puede que en toda la funciónno tenga que ser this.gifId sino this.parent.gifId
	let favorites = JSON.parse(localStorage.getItem("favGifs"));
	if (!favorites.includes(this.gifId)) {
		//a. Se agrega el gif a favoritos.
		this.classList.remove("far");
		this.classList.add("fas");
		favorites.push(this.gifId);
		localStorage.setItem("favGifs", JSON.stringify(favorites));
		return;
	}
	//b. El gif ya estaba en favoritos y se elimina:
	this.classList.remove("fas");
	this.classList.add("far");
	favorites = favorites.filter((favorite) => favorite != this.gifId);
	localStorage.setItem("favGifs", JSON.stringify(favorites));
	//Elimina la tarjeta del DOM si estamos en la sección de favoritos.
	const gifElement = this.parentElement.parentElement.parentElement;
	if (gifElement.parentElement.classList.contains("favorites-ctn")) {
		removeGifCardFromDOM(gifElement)
	}
}

function deleteMyGifo() {
	let myGifos = JSON.parse(localStorage.getItem("myGifs"));
	myGifos = myGifos.filter((gifo) => gifo != this.gifId);
	localStorage.setItem("myGifs", JSON.stringify(myGifos));
	const gifCard = this.parentElement.parentElement.parentElement
	removeGifCardFromDOM(gifCard)
}

function removeGifCardFromDOM(gifCard) {
	const ctn = gifCard.parentElement;
	gifCard.remove();
	if (ctn.children.length === 0) {
		ctn.parentElement.classList.add("hidden");
		ctn.parentElement.nextElementSibling.classList.remove("hidden");
	}
}

async function downloadGif() {
	const a = document.createElement('a');
	const response = await fetch(this.dataset.gifUrl);
	const file = await response.blob();
	a.download = `${this.dataset.title}.gif`;
	a.href = window.URL.createObjectURL(file);
	a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
	a.click()
}

function displayFullScreen() {
	let gif = this.parentElement; //Si se llegó presionando la imagen (mobile).
	if (!gif.classList.contains("gif-card")) {
		gif = gif.parentElement.parentElement; //Si se llegó presionando el botón (desktop).
	}

	//a. El usuario entró a modo fullscreen.
	if (gif.id !== "on-fullscreen-gif") {
		gif.children[1].children[0].lastElementChild.classList.remove("fa-download");
		gif.children[1].children[0].lastElementChild.classList.add("fa-times");
		gif.setAttribute("id", "on-fullscreen-gif");
		return;
	}

	//b. El usuario quiere salir de modo fullscreen.
	gif.children[1].children[0].lastElementChild.classList.remove("fa-times");
	gif.children[1].children[0].lastElementChild.classList.add("fa-download");
	gif.setAttribute("id", "");

}

//2.a. Funcionalidad del carrusel en desktop.

const carrouselCtn = trendingCardsCtn.parentElement.parentElement;
let carrouselScroll = 0;

carrouselCtn.firstElementChild.addEventListener("mousedown", () => {
	carrouselScroll = (carrouselScroll < -180) ? carrouselScroll + 180 : 0;
	trendingCardsCtn.style.marginLeft = `${carrouselScroll}px`;
});

carrouselCtn.lastElementChild.addEventListener("mousedown", () => {
	const width = trendingCardsCtn.offsetWidth;
	const ctnWidth = trendingCardsCtn.parentElement.offsetWidth;
	carrouselScroll = (carrouselScroll > -(width - ctnWidth - 180)) ? carrouselScroll - 180 : -(width - ctnWidth);
	trendingCardsCtn.style.marginLeft = `${carrouselScroll}px`;
}
);
