// Variables
let tareas = [];
let filtroActual = 'todas';

// Función para agregar una tarea
function agregarTarea() {
    const inputTarea = document.getElementById('inputTarea');
    const textoTarea = inputTarea.value.trim();

    if (textoTarea) {
        const tarea = {
            id: Date.now(),
            texto: textoTarea,
            completada: false
        };

        tareas.push(tarea);
        inputTarea.value = '';
        guardarTareas();
        renderizarTareas();
    }
}

// Función para renderizar las tareas en el DOM
function renderizarTareas() {
    const listaTareas = document.getElementById('listaTareas');
    listaTareas.innerHTML = '';

    const tareasFiltradas = tareas.filter(tarea => {
        if (filtroActual === 'completadas') {
            return tarea.completada;
        } else if (filtroActual === 'incompletas') {
            return !tarea.completada;
        }
        return true;
    });

    tareasFiltradas.forEach(tarea => {
        const tareaDiv = document.createElement('div');
        tareaDiv.className = 'tarea';

        const textoTarea = document.createElement('span');
        textoTarea.textContent = tarea.texto;
        if (tarea.completada) {
            textoTarea.style.textDecoration = 'line-through';
        }

        const botonCompletar = document.createElement('button');
        botonCompletar.className = 'boton-completar';
        botonCompletar.textContent = tarea.completada ? 'Incompleta' : 'Completa';
        botonCompletar.onclick = () => alternarCompletadoTarea(tarea.id);

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'boton-eliminar';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarTarea(tarea.id);

        tareaDiv.appendChild(textoTarea);
        tareaDiv.appendChild(botonCompletar);
        tareaDiv.appendChild(botonEliminar);

        listaTareas.appendChild(tareaDiv);
    });
}

// Función para alternar la finalización de una tarea
function alternarCompletadoTarea(idTarea) {
    tareas = tareas.map(tarea => {
        if (tarea.id === idTarea) {
            tarea.completada = !tarea.completada;
        }
        return tarea;
    });

    guardarTareas();
    renderizarTareas();
}

// Función para eliminar una tarea
function eliminarTarea(idTarea) {
    tareas = tareas.filter(tarea => tarea.id !== idTarea);

    guardarTareas();
    renderizarTareas();
}

// Función para guardar las tareas en localStorage
function guardarTareas() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    } else {
        console.error('localStorage no está disponible.');
    }
}

// Función para cargar las tareas desde localStorage
function cargarTareas() {
    if (typeof localStorage !== 'undefined') {
        const tareasGuardadas = localStorage.getItem('tareas');
        if (tareasGuardadas) {
            tareas = JSON.parse(tareasGuardadas);
        }
    } else {
        console.error('localStorage no está disponible.');
    }
}

// Función para cambiar el filtro actual
function cambiarFiltro(nuevoFiltro) {
    filtroActual = nuevoFiltro;
    document.querySelectorAll('#filtros button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filtro${nuevoFiltro.charAt(0).toUpperCase() + nuevoFiltro.slice(1)}`).classList.add('active');
    renderizarTareas();
}

// Inicializar la aplicación
cargarTareas();
renderizarTareas();

// Event Listeners para los botones de filtro
document.getElementById('filtroTodas').onclick = () => cambiarFiltro('todas');
document.getElementById('filtroCompletadas').onclick = () => cambiarFiltro('completadas');
document.getElementById('filtroIncompletas').onclick = () => cambiarFiltro('incompletas');
