// Crear un buscador de peliculas atacando a la API que contenga:
// Input para escribir la película
// Muestre las películas con:
// Imagen
// Título
// Descripción
// Muestra el género de las películas

const API_KEY = "39e0f2e5385d003da84926c3b0a39165"; // ← Reemplaza con tu clave real
const API_URL = "https://api.themoviedb.org/3/search/movie";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

//Cuando hagan clic en el botón, busca películas con ese nombre
window.onload = () => {
    document.getElementById("btnBuscar").addEventListener("click", async () => {
        
        const query = document.getElementById("inputBusqueda").value;

        if(!query)
        {
            return alert("escribe una pelicula");
        }

        //Buscador de pelicula en la api
        const peliculas = await buscadorPelicula(query);

        //Mostrar datos pelicula en el dom
        mostrarPeliculas(peliculas);
    });
};

//Buscar películas usando la API
async function buscadorPelicula(nombre)
{
    try
    {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(nombre)}`);
        const data = await response.json();

        return data.results;
    }
    catch(error){
        console.error("Error al buscar películas:", error);
        return [];
    }
}

//Mostrar películas en pantalla en el dom
async function mostrarPeliculas(peliculas) {
    
    const contenedor = document.getElementById("resultadoPeliculas");
    contenedor.innerHTML = "";

    for(const pelicula of peliculas)
    {
        const generoTexto = await obtenrGeneros(pelicula.genre_ids)
        const div = document.createElement("div");

        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${pelicula.poster_path}" alt="${pelicula.title}">
        <h2>${pelicula.title}</h2>
        <p>${pelicula.overview || 'Sin descripción disponible'}</p>
        <p><strong>Géneros:</strong> ${generoTexto}</p>
        `;

        contenedor.appendChild(div);
    }

}

let generosGlobal = [];
 
async function obtenrGeneros(ids) {

    if (generosGlobal.length === 0)
    {
        await obtenerGenerosPorId();
    } 
        

    const nombres = ids.map(id => {
        const genero = generosGlobal.find(g => g.id === id);
        return genero ? genero.name : "Desconocido";
    });

    return nombres.join(", ");
}

// Función para obtener los géneros de la API y guardarlos en la variable global
async function obtenerGenerosPorId() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es`);
        const data = await response.json();
        generosGlobal = data.genres;
    } catch (error) {
        console.error("Error al obtener géneros:", error);
        generosGlobal = [];
    }
}