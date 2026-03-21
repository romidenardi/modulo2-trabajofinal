# Sobre el proyecto
***

El proyecto se orienta al desarrollo de una aplicación de reserva de salas para el Centro Comercial e Industrial de Rafaela y la Región (CCIRR). La entidad agrupa a emprendedores y empresas de la industria, el comercio y los servicios. 

Entre otros servicios, organiza eventos y capacitaciones. También realiza reuniones sectoriales y con los distintos niveles de gobierno y alquila las salas a socios y no socios.

## Objetivo
***

Crear una aplicación para la reserva y consulta de la disponibilidad de las salas de la entidad.

## Requerimientos 
***

* Registro de todos los datos del evento: sala, fecha, hora de inicio y fin, tema, usuario, servicios de cocina contratados y comentarios adicionales.
* Bloqueo de la sala para evitar reservas superpuestas.
* Calendario de reservas para verificar disponibilidad.

## Tecnologías y librerías utilizadas
***

* HTML.
* CSS.
* Bootstrap.
* JavaScript.

### Utilización de IA
***

Se utilizó IA generativa para:
* Crear clases y funciones que resultaban complejas.
* Lograr que las reservas queden guardadas en LocalStorage para su manipulación.
* Mejorar la funcionalidad y usabilidad del proyecto en general.

## Roadmap
***

### Pantallas (HTML)
***

* Index: Permite crear y editar reservas.
* Calendario: Permite ver, filtrar y eliminar reservas.

### Funcionalidad (JS)
***

* App: Es el script principal.
* Calendario: Es donde se guardan los datos.
* Reserva: Es donde se genera cada elemento del calendario.

### Flujo creación de reserva (DOM + JS)
***

En INDEX:

1. El usuario completa el formulario.
2. Hace click en “Reservar”.
3. Se crea una reserva, se guarda en localStorage y se limpia el formulario.

### Flujo visualización de reservas (DOM + JS)
***

En CALENDARIO:

1. Se cargan las reservas desde localStorage.
2. Si no hay reservas, muestra "No hay reservas vigentes".
3. Si hay reservas, por cada una crea una tarjeta, muestra la info y agrega los botones para editar y eliminar.

### Flujo visualización de reservas (DOM + JS)
***

En CALENDARIO:

1. El usuario hace click en "Editar".
2. Se lo redirecciona a INDEX.
3. Se cargan los datos de la reserva a editar en el form.
4. Cambian los botones para guardar la edición o cancelarla.
5. El usuario modifica y guarda los cambios.
6. Se guardan los cambios en localStorage y se limpia el form.

### Flujo visualización de reservas (DOM + JS)
***

En CALENDARIO:

1. El usuario hace click en “Eliminar”.
2. Se muestra el mensaje de "Eliminando", se deshabilitan los botones para eliminar o editar y se habilita el botón para deshacer la eliminación.
3. Se activa la espera de 5 segundos.
4. Si el usuario NO deshace, se elimina la reserva.
5. Si el usuario SÍ deshace, se cancela la eliminación de la reserva.
  
### Flujo filtrado de reservas (DOM + JS)
***

En CALENDARIO:

1. El usuario aplica un filtro.
2. Se aplican los filtros para mostrar las reservas que coinciden con estos.
3. Si no hay reservas que coincidan, muestra "No hay reservas vigentes".