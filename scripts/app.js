    import Reserva from "./reserva.js";
    import Calendario from "./calendario.js";

    class App {

        constructor() {

            this.form = document.getElementById("formReserva");

            const lista = document.getElementById("listaReservas");

            this.reservas = [];

            this.calendario = lista 
                ? new Calendario(
                    lista,
                    (reservasActualizadas) => {
                        this.reservas = reservasActualizadas;
                        localStorage.setItem("reservas", JSON.stringify(this.reservas));
                    },
                    (reserva) => this.cargarReservaEnFormulario(reserva)
                )
                : null;

            this.init();
        }

        init() {

            if (this.form) {
                this.form.addEventListener("submit", (event) => {
                    event.preventDefault();
                    this.crearReserva();
                });
            }

            const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
            this.reservas = reservasGuardadas.map(r => new Reserva(r));

            if (this.calendario) {
                this.calendario.setearReservas(this.reservas);
            }

            const radios = document.querySelectorAll('input[name="sala"]');
            const imagenPrincipal = document.getElementById("imagenPrincipal");

            radios.forEach(radio => {
                radio.addEventListener("change", () => {
                    const label = radio.closest("label");
                    const img = label?.querySelector(".miniatura");

                    if (img && imagenPrincipal) {
                        imagenPrincipal.classList.add("fade-out");
                        setTimeout (() => {
                        imagenPrincipal.src = img.src;
                        imagenPrincipal.classList.remove("fade-out");
                        },300);
                     }
                });
            });

            const reservaAEditar = JSON.parse(localStorage.getItem("reservaAEditar"));
                if (reservaAEditar && this.form) {
                    this.cargarReservaEnFormulario(reservaAEditar);
                    localStorage.removeItem("reservaAEditar");
                }

            const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
                if (btnCancelarEdicion) {
                    btnCancelarEdicion.addEventListener("click", () => {
                        this.cancelarEdicion();
                    });
                }
        }

        crearReserva() {

            if (!this.form) return;

            const datos = new FormData(this.form);
            const id = datos.get("id");

            const reserva = new Reserva({
                id: id ? Number(id) : Date.now(),
                sala: datos.get("sala"),
                fecha: datos.get("fecha"),
                horaInicio: datos.get("inicio"),
                horaFin: datos.get("fin"),
                tema: datos.get("tema"),
                usuario: datos.get("usuario"),
                servicios: datos.getAll("servicios"),
                comentarios: datos.get("comentarios") || "Sin comentarios"
            });

            if (!this.validarFecha(reserva)) return;
            if (!this.validarHora(reserva)) return;
            if (!this.validarConflicto(reserva)) return;

            if (id) {
                this.reservas = this.reservas.map(r =>
                    r.id === Number(id) ? reserva : r
                );
                this.mostrarMensaje("Reserva modificada exitosamente.");
            } else {
                this.reservas.push(reserva);
                this.mostrarMensaje("Reserva creada exitosamente");
            }

            localStorage.setItem("reservas", JSON.stringify(this.reservas));

            if (this.calendario) {
                this.calendario.setearReservas(this.reservas);
            }

            this.form.reset();
            this.form.elements["id"].value = "";
            document.getElementById("btnCrearReserva").textContent = "Reservar";
            document.getElementById("btnCancelarEdicion").style.display = "none";

        }

        cargarReservaEnFormulario(reserva) {

            this.form.elements["id"].value = reserva.id;

            if (!this.form) return;

            const radios = this.form.querySelectorAll('input[name="sala"]');
                radios.forEach(radio => {
                    if (radio.value === reserva.sala) {
                        radio.checked = true;

                        const label = radio.closest("label");
                        const img = label?.querySelector(".miniatura");
                        const imagenPrincipal = document.getElementById("imagenPrincipal");

                        if (img && imagenPrincipal) {
                            imagenPrincipal.src = img.src;
                        }
                    }
                });

            this.form.elements["fecha"].value = reserva.fecha;
            this.form.elements["inicio"].value = reserva.horaInicio;
            this.form.elements["fin"].value = reserva.horaFin;
            this.form.elements["tema"].value = reserva.tema;
            this.form.elements["usuario"].value = reserva.usuario;
            this.form.elements["comentarios"].value = reserva.comentarios;
            this.form.querySelectorAll('input[name="servicios"]').forEach(chk => {
                chk.checked = reserva.servicios.includes(chk.value);
            });

            document.getElementById("btnCrearReserva").textContent = "Guardar cambios";
            document.getElementById("btnCancelarEdicion").style.display = "inline";
            
        }  
        
        validarFecha(reserva) {
            const hoy = new Date();
            hoy.setHours(0,0,0,0);

            const fechaReserva = new Date(reserva.fecha);

            if (fechaReserva < hoy) {
                alert("La fecha de reserva debe ser igual o posterior a la fecha del día");
                return false;
            }
            return true;
        }

        validarHora(reserva) {
            if (reserva.horaFin <= reserva.horaInicio) {
                alert("La hora de finalización debe ser posterior a la de inicio.");
                return false;
            }
            return true;
        }

        validarConflicto(reserva) {
            const hayConflicto = this.reservas.some(r =>
                r.id !== reserva.id &&
                r.sala === reserva.sala &&
                r.fecha === reserva.fecha &&
                reserva.horaInicio < r.horaFin &&
                reserva.horaFin > r.horaInicio
            );

            if (hayConflicto) {
                alert(`La sala ${reserva.sala} ya tiene una reserva el ${reserva.fecha} entre ${reserva.horaInicio} y ${reserva.horaFin}.`);
                return false;
            }
            return true;
        }

        cancelarEdicion() {
            this.form.reset();
            this.form.elements["id"].value = "";
            document.getElementById("btnCrearReserva").textContent = "Reservar";
            document.getElementById("btnCancelarEdicion").style.display = "none";
        }

        mostrarMensaje(texto) {
            const mensaje = document.getElementById("mensajeExito");
            if (!mensaje) return;

            mensaje.textContent = texto;
            mensaje.style.display = "block";

            setTimeout(() => {
                mensaje.style.display = "none";
            }, 5000);
        }
    }

    new App();