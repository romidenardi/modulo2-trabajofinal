import Reserva from "./reserva.js";

export default class Calendario {

    constructor(elementoLista, onChange) {
        this.lista = elementoLista;
        this.reservas = [];
        this.onChange = onChange;
    }

    setearReservas(reservas) {
        this.reservas = reservas;
        this.render();
    } 

    agregarReserva(reserva) {
        this.reservas.push(reserva);
        this.render();
    }

    eliminarReserva(id) {
        this.reservas = this.reservas.filter(r => r.id !== id);
        if (this.onChange) {
            this.onChange(this.reservas);
        }
        this.render();    
    }

    render() {

        this.lista.innerHTML = "";

        this.reservas
            .sort((a, b) => a.fechaHoraInicio.localeCompare(b.fechaHoraInicio))
            .forEach(reserva => {
                const li = document.createElement("li");
                const span = document.createElement("span");
                const listaServicios = reserva.servicios.length
                ? reserva.servicios.join(", ")
                : "Ninguno";
                span.innerHTML = `<strong>${reserva.sala}</strong> | ${reserva.fecha} | ${reserva.horaInicio} - ${reserva.horaFin}<br>
                            Tema: ${reserva.tema}<br>
                            Usuario: ${reserva.usuario}<br>
                            Servicios: ${listaServicios}<br>
                            Comentarios: ${reserva.comentarios}`;
            
            const btnEditarReserva = document.createElement("button");
            btnEditarReserva.textContent = "Editar";

            btnEditarReserva.addEventListener("click", () => {
                const nuevoTema = prompt("Editar tema:", reserva.tema);
                if (nuevoTema && nuevoTema.trim() !== "") {
                    this.reservas = this.reservas.map(r => 
                        r.id === reserva.id
                            ? new Reserva({ ...r, tema: nuevoTema.trim() })
                            : r
                    );
                    if (this.onChange) {
                        this.onChange(this.reservas);
                    }
                    this.render();
                }
            });

            const btnEliminarReserva = document.createElement("button");
            btnEliminarReserva.textContent = "Eliminar";

            const btnDeshacerEliminacion = document.createElement("button");
            btnDeshacerEliminacion.textContent = "Deshacer";
            btnDeshacerEliminacion.style.display = "none";

            let timeoutEliminarReserva;

            btnEliminarReserva.addEventListener("click", () => {
                span.innerHTML = "Eliminando...";
                btnEliminarReserva.disabled = true;
                btnEditarReserva.disabled = true;
                btnDeshacerEliminacion.style.display = "inline";
                timeoutEliminarReserva = setTimeout(() => {
                    this.eliminarReserva(reserva.id);
                }, 5000);
            });

            btnDeshacerEliminacion.onclick = () => {
                if (timeoutEliminarReserva) {
                    clearTimeout(timeoutEliminarReserva);
                }
                this.render();
            };

            li.appendChild(span); 
            li.appendChild(btnEditarReserva); 
            li.appendChild(btnEliminarReserva);
            li.appendChild(btnDeshacerEliminacion);

            this.lista.appendChild(li);
        });
    }
}