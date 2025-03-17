document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
});
document.addEventListener('DOMContentLoaded', () => {

    /* Gestor de Tareas */

    // Función para cargar datos desde localStorage
    const cargarDatos = () => {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    }

    // Función para guardar datos en localStorage
    const guardarDatos = (tareas) => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    // Función para agregar una nueva tarea
    const agregarTarea = (tarea) => {
        const tareas = cargarDatos();
        tareas.push(tarea);
        guardarDatos(tareas);
    }

    // Función para mostrar las tareas guardadas
    const mostrarTareas = () => {
        const tareas = cargarDatos();
        const contenedorTareas = document.getElementById('tareas');
        contenedorTareas.innerHTML = '';

        tareas.forEach((tarea, indice) => {
            const tarjetaTarea = document.createElement('article');
            tarjetaTarea.classList.add('tarea-card');
            tarjetaTarea.innerHTML = `
            <h3>${tarea.titulo}</h3>
            <progress value="${tarea.progreso}" max="100">${tarea.progreso}</progress>
            <button onclick="verDetalles('${tarea.tareaId}')">Ver detalles</button>
        `;
            contenedorTareas.appendChild(tarjetaTarea);
        });
    }

    // Recoger los datos del formulario
    document.getElementById('formularioTareas').addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const tareaId = titulo.trim();
        const descripcion = document.getElementById('descripcion').value;
        const fechaLimite = document.getElementById('fechaLimite').value;
        const prioridad = document.getElementById('prioridad').value;
        const progreso = document.getElementById('progreso').value ? document.getElementById('progreso').value : 0;
        const dependencias = document.getElementById('dependencias').value;

        const nuevaTarea = {
            titulo,
            tareaId,
            descripcion,
            fechaLimite,
            prioridad,
            progreso,
            dependencias
        };

        agregarTarea(nuevaTarea);

        // Limpiar el formulario
        document.getElementById('formularioTareas').reset();

        // Mostrar las tareas actualizadas
        mostrarTareas();
    });

    // Mostrar las tareas al cargar la página
    mostrarTareas();

});
