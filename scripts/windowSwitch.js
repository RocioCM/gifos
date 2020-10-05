//FUNCIONALIDAD DE LINKS DEL HEADER-NAV, DISPLAY DE SECCIÓN DE FAVORITOS Y MIS GIFOS.


//Inicializa los favoritos.
if (!localStorage.getItem("favGifs")) localStorage.setItem("favGifs", "[]");


//0. Links del header funcionales.
const headerMenuSwitch = document.getElementById("burguer-switch");
const homeLogo = document.getElementById("home-logo");
const navLinks = Array.from(document.getElementById("header-links").children);
const hiddenSections = Array.from(document.querySelectorAll(".hidden-section"));
//Datos: hiddenSection[0] y [1] trae a search-section y searched-section respectivamente.
//Y [2] y [3] se corresponden a las secciones de favoritos y myGifos respectivamente.
//Y [4] es la pantalla de fullscreen gif.
const fullscreen = hiddenSections.pop()

//Si el usuario proviene de CreateGifo desde los links del headerNav:
if (window.location.hash === "#favorites") {
  openFavorites();
} else if (window.location.hash === "#gifos") {
  openMyGifos();
};

navLinks[1].addEventListener("click", openFavorites);
navLinks[2].addEventListener("click", openMyGifos);
homeLogo.addEventListener("click", displayHomescreen);


function openFavorites() {
  navLinks[1].classList.add("active-link");
  navLinks[2].classList.remove("active-link");
  const favoritesSection = hiddenSections[2];
  const favoritesGifs = JSON.parse(localStorage.getItem("favGifs"));
  displayGifsByIdGallery(favoritesGifs, favoritesSection);
}
function openMyGifos() {
  navLinks[2].classList.add("active-link");
  navLinks[1].classList.remove("active-link");
  const myGifosSection = hiddenSections[3];
  const myGifs = JSON.parse(localStorage.getItem("myGifs"));
  displayGifsByIdGallery(myGifs, myGifosSection);
}

function displayGifsByIdGallery(gifsIds, gallerySection) {
  headerMenuSwitch.checked = false;
  hiddenSections.forEach(section => section.classList.add("hidden"));
  gallerySection.classList.remove("hidden");

  if (gifsIds !== null && gifsIds.length !== 0) {//Muestra la galería.
    gallerySection.children[2].classList.remove("hidden");
    gallerySection.children[3].classList.add("hidden");
    displaySectionGifs(gifsIds, gallerySection.children[2].firstElementChild);
    if (gifsIds.length <= 12) { gallerySection.children[2].lastElementChild.classList.add("hidden") }
    else { gallerySection.children[2].lastElementChild.classList.remove("hidden") };
  } else { //Muestra la sección de "No hay Gifs".
    gallerySection.children[2].classList.add("hidden");
    gallerySection.children[3].classList.remove("hidden");
  }
}


async function displaySectionGifs(gifsIds, gifsCtn) {//Muestra en gifsCtn los gifs cuyos ids están en el array gifsIds.
  gifsCtn.innerHTML = "";
  gifsIds = gifsIds.join(); //Formatea los ids al formato que la API requiere.

  try {
    let gifs = await fetch(`https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${gifsIds}`);
    gifs = await gifs.json();
    gifs = gifs.data;
    gifs.forEach(gif => addGifToDOM(gif, gifsCtn));
  } catch (error) {
    console.log("No se ha podido cargar el gif: " + error);
  }
};


function displayHomescreen() {
  const searchSection = hiddenSections[0];
  hiddenSections.forEach(section => section.classList.add("hidden")); //Oculta todas las secciones.
  navLinks.forEach((sectionLink => sectionLink.classList.remove("active-link"))); //Le quita el color gris al header link de la sección abierta antes. 
  searchSection.classList.remove("hidden") //Muestra sólo la sección deseada.
}