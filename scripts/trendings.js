//TRENDING TOPICS + TRENDING GIFS


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



//2. Trending GIFs carrousel.

//2.a. Busca y rellena los trending GIFs.

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
		gifs = gifs.data;
		gifs.forEach((gif) => addGifToDOM(gif, trendingCardsCtn, false)); //Crea cada card y la agrega al DOM.
	} catch (error) {
		console.log(`Trending Gifs: \n${error}`);
	}
}


//2.b. Funcionalidad del carrusel en desktop.

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



////EEEEEEPA: DETALLES
//3. En addGifToDOM, cuando setea el gif, también podría ser .downsized_medium.url, pesa un poco más. Pero, dato, nunca uses los still, no funcionan.
//10. Nah. Hacer la compatibilidad del carrousel scroll entre mobile y desktop:
//Capaz te sirva: https://stackoverflow.com/questions/4096863/how-to-get-and-set-the-current-web-page-scroll-position

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
