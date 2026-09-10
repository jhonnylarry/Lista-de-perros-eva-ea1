const perroActualElement = document.getElementById("perroActual");
const spinner = document.getElementById("spinner");
const errorMensaje = document.getElementById("errorMensaje");
const perrosLikeContainer = document.getElementById("perrosLikeContainer");
const perrosDislikeContainer = document.getElementById(
  "perrosDislikeContainer"
);
perrosLikeContainer.classList.toggle("escondido");
perrosDislikeContainer.classList.toggle("escondido");

const contadorLikesElement = document.getElementById("contadorLikes");
const contadorDislikesElement = document.getElementById("contadorDislikes");

let perroActual;
let totalLikes = 0;
let totalDislikes = 0;

document.getElementById("like").addEventListener("click", () => {
  rankearPerro("+");
});
document.getElementById("dislike").addEventListener("click", () => {
  rankearPerro("-");
});
document.getElementById("saltear").addEventListener("click", nuevoPerro);
document.getElementById("reintentar").addEventListener("click", nuevoPerro);
document.getElementById("reiniciar").addEventListener("click", reiniciarHistorial);
perroActualElement.addEventListener("load", () => {
  spinner.classList.toggle("escondido", true);
  perroActualElement.classList.toggle("escondido", false);
});

function rankearPerro(ranking) {
  const nuevaImagen = document.createElement("img");
  nuevaImagen.src = perroActual;
  if (ranking === "+") {
    perrosLikeContainer.appendChild(nuevaImagen);
    perrosLikeContainer.classList.toggle("escondido",false)
    totalLikes++;
    contadorLikesElement.textContent = `👍🏻 ${totalLikes}`;
  } else {
    perrosDislikeContainer.appendChild(nuevaImagen);
    perrosDislikeContainer.classList.toggle("escondido",false)
    totalDislikes++;
    contadorDislikesElement.textContent = `👎🏻 ${totalDislikes}`;
  }
  nuevoPerro();
}

async function nuevoPerro() {
  perroActualElement.classList.toggle("escondido", true);
  errorMensaje.classList.toggle("escondido", true);
  spinner.classList.toggle("escondido", false);
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const jsonRes = await res.json();
    if (jsonRes.status !== "success") throw new Error("Respuesta inválida de la API");
    perroActual = jsonRes.message;
    perroActualElement.src = perroActual;
  } catch (error) {
    console.error("No se pudo obtener un perrito:", error);
    spinner.classList.toggle("escondido", true);
    errorMensaje.classList.toggle("escondido", false);
  }
}

function reiniciarHistorial() {
  perrosLikeContainer.innerHTML = "";
  perrosDislikeContainer.innerHTML = "";
  perrosLikeContainer.classList.toggle("escondido", true);
  perrosDislikeContainer.classList.toggle("escondido", true);
  totalLikes = 0;
  totalDislikes = 0;
  contadorLikesElement.textContent = `👍🏻 ${totalLikes}`;
  contadorDislikesElement.textContent = `👎🏻 ${totalDislikes}`;
}

//Ejecución
nuevoPerro();
