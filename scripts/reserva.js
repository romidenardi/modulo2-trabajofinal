export default class Reserva {
    
    constructor({id, sala, fecha, horaInicio, horaFin, tema, usuario, servicios, comentarios}) {
        this.id = id;
        this.sala = sala;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.tema = tema;
        this.usuario = usuario;
        this.servicios = servicios || [];
        this.comentarios = comentarios || "Sin comentarios";
    }

    get fechaHoraInicio() {
        return `${this.fecha}T${this.horaInicio}`;
    }
}