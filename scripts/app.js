import Reserva from "./reserva.js";
import Calendario from "./calendario.js";

class App {

    constructor() {

        this.form = document.getElementById("formReserva");
        this.formEditar = document.getElementById("formEditar");
        this.modal = null;

        const lista = document.getElementById("listaReservas");

        this.reservas = [];

        this.calendario = lista 
            ? new Calendario(
                lista,
                (reservasActualizadas) => {
                    this.reservas = reservasActualizadas;
                    localStorage.setItem("reservas", JSON.stringify(this.reservas));
                },
                (reserva) => this.abrirModalEdicion(reserva)
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

        if (this.formEditar) {
            this.modal = new bootstrap.Modal(document.getElementById("modalEditar"));

            this.formEditar.addEventListener("submit", (e) => {
                e.preventDefault();
                this.guardarEdicion();
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
                    imagenPrincipal.src = img.src;
                }
            });
        });
    }

    crearReserva() {

        if (!this.form) return;

        const datos = new FormData(this.form);

        const reserva = new Reserva({
            id: Date.now(),
            sala: datos.get("sala"),
            fecha: datos.get("fecha"),
            horaInicio: datos.get("inicio"),
            horaFin: datos.get("fin"),
            tema: datos.get("tema"),
            usuario: datos.get("usuario"),
            servicios: datos.getAll("servicios"),
            comentarios: datos.get("comentarios")
        });

        if (!this.validarFecha(reserva)) return;
        if (!this.validarHora(reserva)) return;
        if (!this.validarConflicto(reserva)) return;

        this.reservas.push(reserva);

        localStorage.setItem("reservas", JSON.stringify(this.reservas));

        if (this.calendario) {
            this.calendario.setearReservas(this.reservas);
        }

        this.form.reset();
    }

    abrirModalEdicion(reserva) {

    if (!this.formEditar) return;

    this.formEditar.elements["id"].value = reserva.id;
    this.formEditar.elements["sala"].value = reserva.sala;
    this.formEditar.elements["fecha"].value = reserva.fecha;
    this.formEditar.elements["inicio"].value = reserva.horaInicio;
    this.formEditar.elements["fin"].value = reserva.horaFin;
    this.formEditar.elements["tema"].value = reserva.tema;
    this.formEditar.elements["usuario"].value = reserva.usuario;
    this.formEditar.elements["comentarios"].value = reserva.comentarios;
    this.formEditar.querySelectorAll('input[name="servicios"]').forEach(chk => {
        chk.checked = reserva.servicios.includes(chk.value);
        });
    this.modal.show();

    }

    guardarEdicion() {
        const datos = new FormData(this.formEditar);

        const reservaEditada = new Reserva({
            id: Number(datos.get("id")),
            sala: datos.get("sala"),
            fecha: datos.get("fecha"),
            horaInicio: datos.get("inicio"),
            horaFin: datos.get("fin"),
            tema: datos.get("tema"),
            usuario: datos.get("usuario"),
            servicios: datos.getAll("servicios"),
            comentarios: datos.get("comentarios")
        });

        if (!this.validarFecha(reservaEditada)) return;
        if (!this.validarHora(reservaEditada)) return;
        if (!this.validarConflicto(reservaEditada)) return;

        this.reservas = this.reservas.map(r =>
            r.id === reservaEditada.id ? reservaEditada : r
        );

        localStorage.setItem("reservas", JSON.stringify(this.reservas));

        if (this.calendario) {
            this.calendario.setearReservas(this.reservas);
        }

        this.modal.hide();
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
}

new App();