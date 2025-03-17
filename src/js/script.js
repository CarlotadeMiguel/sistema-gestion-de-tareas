document.addEventListener('DOMContentLoaded', () => {

    /* Gestor de Tareas */
    const contenedorTareas = document.getElementById('tareas');
    let dialog;

    // Función para cargar datos desde localStorage
    const cargarDatos = () => {
        return JSON.parse(localStorage.getItem('tareas')) || [];
    }
    let tareas = cargarDatos();

    // Función para guardar datos en localStorage
    const guardarDatos = (tareas) => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }

    // Función para agregar una nueva tarea
    const agregarTarea = (tarea) => {
        tareas.push(tarea);
        guardarDatos(tareas);
    }

    //Función para eliminar una tarea
    eliminarTarea = (id) => {
        tareas = tareas.filter(tarea => tarea.tareaId !== id);
        guardarDatos(tareas);
        mostrarTareas();
    }

    // Función para mostrar las tareas guardadas
    const mostrarTareas = () => {
        contenedorTareas.innerHTML = '';
        tareas.forEach((tarea) => {
            const tarjetaTarea = document.createElement('article');
            tarjetaTarea.classList.add('tarea-card');
            tarjetaTarea.innerHTML = `
            <h3>${tarea.titulo}</h3>
            <progress value="${tarea.progreso}" max="100">${tarea.progreso}</progress>
            <button onclick="abrirDialogo('${tarea.tareaId}')">Ver detalles</button>
            <button onclick="eliminarTarea('${tarea.tareaId}')">Borrar Tarea</button>
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
    cerrarDialogo = () => {
        dialog.close();
    }

    // Recoger los datos del formulario
    document.getElementById('formularioTareas').addEventListener('submit', (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const numId = tareas.length + 1;
        const tareaId = titulo.trim() + numId;
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
  console.log("DOMContentLoaded");

  const form = document.getElementById("form-reserva");
  const telefonoInput = document.getElementById("telefono");
  const fechaInput = document.getElementById("fecha");
  const errorMessage = document.getElementById("error-message");
  const reservasContainer = document.createElement("div");
  reservasContainer.id = "reservas-container";
  document.body.appendChild(reservasContainer);

  // Validación de fecha para no permitir días pasados
  const today = new Date().toISOString().split("T")[0];
  fechaInput.setAttribute("min", today);

  form.addEventListener("input", validar);

  function validar() {
    errorMessage.textContent = "";

    // Validar teléfono
    const telefonoPattern = /^[0-9]{9}$/;
    if (!telefonoPattern.test(telefonoInput.value)) {
      errorMessage.textContent = "El teléfono debe tener 9 dígitos.";
      return;
    }

    // Validar capacidad máxima
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reservasMismaHora = reservas.filter(
      (reserva) => reserva.fecha === fechaInput.value
    );
    if (reservasMismaHora.length >= 4) {
      errorMessage.textContent = "Capacidad máxima alcanzada para esta hora.";
      return;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validar();

    if (errorMessage.textContent === "") {
      const reserva = {
        id: Date.now(),
        cliente: form.nombre.value,
        cliente2: form.apellido1.value,
        cliente3: form.apellido2.value,
        telefono: form.telefono.value,
        fecha: form.fecha.value,
        personas: form.personas.value,
        estado: "pendiente",
      };

      const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
      reservas.push(reserva);
      localStorage.setItem("reservas", JSON.stringify(reservas));

      form.reset();
      renderReservas();
      alert("Reserva realizada con éxito");
    }
  });

  // Función para renderizar las reservas

  function renderReservas() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const fragment = document.createDocumentFragment();

    reservas.forEach((reserva) => {
      const card = document.createElement("div");
      card.classList.add("reserva-card");
      card.innerHTML = `
            <h3>Reserva #${reserva.id}</h3>
            <p>Cliente: ${reserva.cliente} ${reserva.cliente2} ${reserva.cliente3}</p>
            <p>Teléfono: ${reserva.telefono}</p>
            <p>Fecha: ${reserva.fecha}</p>
            <p>Personas: ${reserva.personas}</p>
            <p>Estado: ${reserva.estado}</p>
        `;
      fragment.appendChild(card);
    });

    reservasContainer.innerHTML = "";
    reservasContainer.appendChild(fragment);
  }

  // Renderizar reservas al cargar la página
  renderReservas();
});
