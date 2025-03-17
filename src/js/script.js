document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");

  const form = document.getElementById("form-reserva");
  const telefonoInput = document.getElementById("telefono");
  const fechaInput = document.getElementById("fecha");
  const errorMessage = document.getElementById("error-message");

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
        cliente: form.apellido1.value,
        cliente: form.apellido2.value,
        telefono: form.telefono.value,
        fecha: form.fecha.value,
        personas: form.personas.value,
        estado: "pendiente",
      };

      const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
      reservas.push(reserva);
      localStorage.setItem("reservas", JSON.stringify(reservas));

      form.reset();
      alert("Reserva realizada con éxito");
    }
  });
});
