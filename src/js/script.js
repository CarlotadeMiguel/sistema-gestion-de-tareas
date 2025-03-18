document.addEventListener("DOMContentLoaded", () => {
  // Constantes globales

  let dialog;
  let tareas;
  const form = document.getElementById("form-reserva");
  const telefonoInput = document.getElementById("telefono");
  const fechaInput = document.getElementById("fecha");
  const errorMessage = document.getElementById("error-message");
  const reservasContainer = document.createElement("div");

  const fechaInputMin = document.getElementById("fechaLimite");
  const contenedorTareas = document.getElementById("tareas");

  // Validación de fecha para no permitir días pasados
  const today = new Date().toISOString().split("T")[0];
  fechaInput.setAttribute("min", today);

  /* Gestor de Tareas */

  // Asignar la fecha mínima al campo date del formulario de tareas
  fechaInputMin.setAttribute("min", today);

  // Función para cargar datos desde localStorage
  const cargarDatos = () => {
    return JSON.parse(localStorage.getItem("tareas")) || [];
  };

  tareas = cargarDatos();

  // Función para guardar datos en localStorage
  const guardarDatos = (tareas) => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  };

  // Función para agregar una nueva tarea
  const agregarTarea = (tarea) => {
    tareas.push(tarea);
    guardarDatos(tareas);
  };

  //Función para eliminar una tarea
  eliminarTarea = (id) => {
    tareas = tareas.filter((tarea) => tarea.tareaId !== id);
    guardarDatos(tareas);
    mostrarTareas();
  };

  // Función para mostrar las tareas guardadas
  const mostrarTareas = () => {
    contenedorTareas.innerHTML = "";
    tareas.forEach((tarea) => {
      const tarjetaTarea = document.createElement("article");
      tarjetaTarea.classList.add("tarea-card");
      tarjetaTarea.innerHTML = `
            <h3>${tarea.titulo}</h3>
            <progress value="${tarea.progreso}" max="100">${tarea.progreso}</progress>
            <button onclick="abrirDialogo('${tarea.tareaId}')">Ver detalles</button>
            <button onclick="eliminarTarea('${tarea.tareaId}')">Borrar Tarea</button>
            <dialog id="${tarea.tareaId}">
                    <form id="formularioTareasEditar">
                        <label for="tituloE">Título:</label>
                        <input type="text" id="tituloE" name="tituloE" value="${tarea.titulo}" required readonly>

                        <label for="tareaIdE">ID: </label>
                        <input type="text" id="tareaIdE" name="tareaIdE" value="${tarea.tareaId}" disabled>

                        <label for="descripcionE">Descripción:</label>
                        <textarea id="descripcionE" name="descripcionE" required readonly> ${tarea.descripcion}</textarea>

                        <label for="fechaLimiteE">Fecha límite:</label>
                        <input type="date" id="fechaLimiteE" name="fechaLimiteE" value="${tarea.fechaLimite}" required readonly>

                        <label for="prioridadE">Prioridad:</label>
                        <select id="prioridadE" name="prioridadE" required readonly> 
                            <option value="${tarea.prioridad}">${tarea.prioridad.charAt(0).toUpperCase() + tarea.prioridad.slice(1)}</option>
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>

                        <label for="progresoE">Progreso:</label>
                        <input type="number" max="100" min="0" id="progresoE" name="progresoE"  value="${tarea.progreso}" readonly></input>

                        <label for="dependenciasE">Dependencias:</label>
                        <input type="text" id="dependenciasE" name="dependenciasE"  value="${tarea.dependencias}" readonly>

                        <button type="submit">Guardar Tarea</button>
                    </form>
                    <button onclick="editarTarea()">Editar Tarea</button>
                    <button onclick="cerrarDialogo()">Cerrar</button>
            </dialog>
            `;
      contenedorTareas.appendChild(tarjetaTarea);
    });
  };

  //Función para mostrar el dialog con los detalles
  abrirDialogo = (id) => {
    dialog = document.getElementById(id);
    dialog.showModal();
  };

  //Función para cerrar el dialog con los detalles
  cerrarDialogo = () => {
    dialog.close();
  };

  //Editar formulario
  editarTarea = () => {
    const formEditar = document.getElementById('formularioTareasEditar');
    const campos = formEditar.querySelectorAll('input, textarea, select');
    campos.forEach(campo => {
      campo.removeAttribute('readonly');
    });

    formEditar.addEventListener('submit', (e) => {
      e.preventDefault();

      const titulo = document.getElementById('tituloE').value;
      const tareaId = document.getElementById('tareaIdE').value;
      const descripcion = document.getElementById('descripcionE').value;
      const fechaLimite = document.getElementById('fechaLimiteE').value;
      const prioridad = document.getElementById('prioridadE').value;
      const progreso = document.getElementById('progresoE').value;
      const dependencias = document.getElementById('dependenciasE').value;

      const nuevaTarea = {
        titulo,
        tareaId,
        descripcion,
        fechaLimite,
        prioridad,
        progreso,
        dependencias
      };

      tareas = tareas.filter(tarea => tarea.tareaId !== nuevaTarea.tareaId);
      guardarDatos(tareas);
      tareas.push(nuevaTarea);
      guardarDatos(tareas);
      console.log(tareas);

      document.getElementById('tituloE').value = titulo;
      document.getElementById('tareaIdE').value = tareaId;
      document.getElementById('descripcionE').value = descripcion;
      document.getElementById('fechaLimiteE').value = fechaLimite;
      document.getElementById('prioridadE').value = prioridad;
      document.getElementById('progresoE').value = progreso;
      document.getElementById('dependenciasE').value = dependencias

      campos.forEach(campo => {
        campo.setAttribute('readonly', true);
      });

      // Mostrar las tareas actualizadas
      mostrarTareas();
    });

  }

  // Recoger los datos del formulario
  document
    .getElementById("formularioTareas")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = document.getElementById("titulo").value;
      const numId = tareas.length + 1;
      const tareaId = titulo.trim() + numId;
      const descripcion = document.getElementById("descripcion").value;
      const fechaLimite = document.getElementById("fechaLimite").value;
      const prioridad = document.getElementById("prioridad").value;
      const progreso = document.getElementById("progreso").value
        ? document.getElementById("progreso").value
        : 0;
      const dependencias = document.getElementById("dependencias").value;

      const nuevaTarea = {
        titulo,
        tareaId,
        descripcion,
        fechaLimite,
        prioridad,
        progreso,
        dependencias,
      };

      agregarTarea(nuevaTarea);

      // Limpiar el formulario
      document.getElementById("formularioTareas").reset();

      // Mostrar las tareas actualizadas
      mostrarTareas();
    });

  // Mostrar las tareas al cargar la página
  mostrarTareas();

  /* Gestor de reservas */

  document.body.appendChild(reservasContainer);
  reservasContainer.id = "reservas-container";

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
        cliente1: form.apellido1.value,
        cliente2: form.apellido2.value,
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

  function renderReservas() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const fragment = document.createDocumentFragment();

    reservas.forEach((reserva) => {
      const card = document.createElement("div");
      card.classList.add("reserva-card");
      card.innerHTML = `
        <h3>Reserva #${reserva.id}</h3>
        <p>Cliente: ${reserva.cliente} ${reserva.cliente1} ${reserva.cliente2}</p>
        <p>Teléfono: ${reserva.telefono}</p>
        <p>Fecha: ${reserva.fecha}</p>
        <p>Personas: ${reserva.personas}</p>
        <p>Estado: ${reserva.estado}</p>
        <button class="delete-btn" data-id="${reserva.id}">Eliminar</button>
      `;

      // Agregar evento para eliminar la reserva
      const deleteButton = card.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => {
        eliminarReserva(reserva.id);
      });

      fragment.appendChild(card);
    });

    reservasContainer.innerHTML = "";
    reservasContainer.appendChild(fragment);
  }

  function eliminarReserva(id) {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas = reservas.filter((reserva) => reserva.id !== id); // Filtrar la reserva a eliminar
    localStorage.setItem("reservas", JSON.stringify(reservas)); // Guardar las reservas actualizadas
    renderReservas(); // Volver a renderizar las reservas
  }

  // Renderizar reservas al cargar la página
  renderReservas();
});
