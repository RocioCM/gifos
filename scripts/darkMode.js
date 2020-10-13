//Depending on the page the script is imported, the switch button could already been fetched.
const switchBtn = (typeof navLinks !== "undefined") ? navLinks[0] : document.querySelector("#theme-switch");

//Verifies if the user has already set darkMode on a previous session.
if (localStorage.getItem("darkMode")) themeSwitch();

switchBtn.addEventListener("click", themeSwitch);
switchBtn.addEventListener("click", themeTransition);


function themeSwitch() {
  if (typeof headerMenuSwitch !== "undefined") headerMenuSwitch.checked = false;
  const root = document.documentElement;
  if (root.classList.contains("dark")) {
    switchBtn.textContent = "Modo Nocturno";
    root.classList.remove("dark");
    localStorage.removeItem("darkMode");
    return;
  }
  switchBtn.textContent = "Modo Diurno";
  root.classList.add("dark");
  localStorage.setItem("darkMode", "on");
}

//Fading theme transition effect.
function themeTransition() {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => {
    root.classList.remove("theme-transition")
  }, 1000);
}
