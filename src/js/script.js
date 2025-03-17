document.addEventListener('DOMContentLoaded', () => {

    /* Gestor de Tareas */
    const contenedorTareas = document.getElementById('tareas');
    let dialog;

    // Función para cargar datos desde localStorage
    const cargarDatos = () => {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    }
    const tareas = cargarDatos();

    // Función para guardar datos en localStorage
    const guardarDatos = (tareas) => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    // Función para agregar una nueva tarea
    const agregarTarea = (tarea) => {
        tareas.push(tarea);
        guardarDatos(tareas);
    }

    // Función para mostrar las tareas guardadas
    const mostrarTareas = () => {
        contenedorTareas.innerHTML = '';
        tareas.forEach((tarea, indice) => {
            const tarjetaTarea = document.createElement('article');
            tarjetaTarea.classList.add('tarea-card');
            tarjetaTarea.innerHTML = `
            <h3>${tarea.titulo}</h3>
            <progress value="${tarea.progreso}" max="100">${tarea.progreso}</progress>
            <button onclick="abrirDialogo('${tarea.tareaId}')">Ver detalles</button>
            <dialog id="${tarea.tareaId}">
                    <h3>${tarea.titulo}</h3>
                    <p id="descripcion-tarea">${tarea.descripcion}</p>
                    <p>Fecha límite: <time id="fecha-limite">${tarea.fechaLimite}</time></p>
                    <p>Prioridad: <meter id="prioridad-tarea" min="0" max="1">${tarea.prioridad}</meter></p>
                    <button onclick="cerrarDialogo()">Cerrar</button>
            </dialog>
            `;
            contenedorTareas.appendChild(tarjetaTarea);
        });
    }

    //Función para mostrar el dialog con los detalles
    abrirDialogo = (id) => {
        dialog = document.getElementById(id);
        dialog.showModal();
    }

    //Función para cerrar el dialog con los detalles
    cerrarDialogo = () =>{
        dialog.close();
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
