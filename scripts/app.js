import Reserva from "./reserva.js";
import Calendario from "./calendario.js";

class App {

    constructor() {
        this.form = document.getElementById("formReserva");
        const lista = document.getElementById("listaReservas");
        this.reservas = [];
        this.calendario = lista 
        ? new Calendario(lista, (reservasActualizadas) => {
            this.reservas = reservasActualizadas;
            localStorage.setItem("reservas", JSON.stringify(this.reservas));
        })
        : null;
        this.init();
    }

    init() {

        if (this.form) {

                this.form.addEventListener("submit", (event) => {
                    event.preventDefault();
                    this.crearReserva();
                });

            const imagenPrincipal = document.getElementById("imagenPrincipal");

            document.querySelectorAll('input[name="sala"]').forEach(radio => {
                radio.addEventListener("change", function () {
                    const label = this.closest("label");
                    const img = label.querySelector(".miniatura");
                    if (img && imagenPrincipal) {
                        imagenPrincipal.src = img.src;
                    }
                });
            });
        }

        const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || [];
        const reservas = reservasGuardadas.map(r => new Reserva(r));
        this.reservas = reservas;

        if (this.calendario) {
            this.calendario.setearReservas(this.reservas);
            }
        }

    crearReserva() {

        const datos = new FormData(this.form);

        const reserva = new Reserva ({
            id: Date.now(),
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
        
        this.reservas.push(reserva);

        localStorage.setItem("reservas",JSON.stringify(this.reservas));

        if (this.calendario) {
            this.calendario.setearReservas(this.reservas);
        }

        this.form.reset();    
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