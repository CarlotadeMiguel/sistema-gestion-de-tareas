document.addEventListener("DOMContentLoaded", () => {
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
