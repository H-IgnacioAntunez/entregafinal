document.addEventListener('DOMContentLoaded', () => {
    let notas = cargarNotas();

    // Mostrar lista de notas al cargar la página
    mostrarListaNotas(notas);

    // Configurar evento del formulario para guardar o editar nota
    document.getElementById('nota-form').addEventListener('submit', (event) => {
        event.preventDefault();
        guardarNuevaNota();
    });
});

// Configuración inicial de toastr
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// Función para cargar las notas del Local Storage
function cargarNotas() {
    let notas = localStorage.getItem('notas');
    if (notas) {
        notas = JSON.parse(notas);
    } else {
        notas = [];
    }
    return notas;
}

// Función para guardar las notas en el Local Storage
function guardarNotas(notas) {
    localStorage.setItem('notas', JSON.stringify(notas));
}

// Función para validar los datos de una nueva nota
function validarNota(titulo, descripcion, calificacion) {
    if (!titulo.trim()) {
        toastr.error('El título de la nota no puede estar vacío.');
        return false;
    }

    if (!descripcion.trim()) {
        toastr.error('La descripción de la nota no puede estar vacía.');
        return false;
    }

    if (isNaN(calificacion) || calificacion < 1 || calificacion > 10) {
        toastr.error('La calificación debe ser un número del 1 al 10.');
        return false;
    }

    return true;
}

// Función para mostrar el formulario de nueva nota
function mostrarFormularioNuevaNota() {
    document.getElementById('formulario-nueva-nota').style.display = 'block';
    document.getElementById('lista-notas').style.display = 'none';

    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('calificacion').value = '';
}

// Función para cancelar la creación de una nueva nota
function cancelarNuevaNota() {
    document.getElementById('formulario-nueva-nota').style.display = 'none';
    document.getElementById('lista-notas').style.display = 'block';
}

// Función para guardar una nueva nota o actualizar una existente
function guardarNuevaNota() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const calificacion = parseInt(document.getElementById('calificacion').value);

    if (!validarNota(titulo, descripcion, calificacion)) {
        return;
    }

    const notas = cargarNotas();
    const idNota = document.getElementById('nota-form').dataset.id;
    
    if (idNota) {
        // Editar nota existente
        const nota = notas.find(nota => nota.id === parseInt(idNota));
        nota.titulo = titulo;
        nota.descripcion = descripcion;
        nota.calificacion = calificacion;
        toastr.success('Nota editada con éxito.');
        delete document.getElementById('nota-form').dataset.id;
    } else {
        // Crear nueva nota
        const nuevaNota = {
            id: notas.length ? notas[notas.length - 1].id + 1 : 1,
            titulo,
            descripcion,
            calificacion
        };
        notas.push(nuevaNota);
        toastr.success('Nota creada con éxito.');
    }

    guardarNotas(notas);
    mostrarListaNotas(notas);
    cancelarNuevaNota();
}

// Función para mostrar la lista de notas
function mostrarListaNotas(notas) {
    const listaNotas = document.querySelector('#lista-notas .list-group');
    listaNotas.innerHTML = '';

    notas.forEach(nota => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = `${nota.titulo} - ${nota.descripcion} - Calificación: ${nota.calificacion}`;
        
        const div = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning btn-sm mr-2';
        editButton.textContent = 'Editar';
        editButton.onclick = () => editarNota(nota.id);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => eliminarNota(nota.id);
        
        div.appendChild(editButton);
        div.appendChild(deleteButton);
        li.appendChild(div);
        
        listaNotas.appendChild(li);
    });
}

// Función para editar una nota
function editarNota(idNota) {
    const notas = cargarNotas();
    const nota = notas.find(nota => nota.id === idNota);

    if (!nota) {
        return;
    }

    document.getElementById('titulo').value = nota.titulo;
    document.getElementById('descripcion').value = nota.descripcion;
    document.getElementById('calificacion').value = nota.calificacion;

    document.getElementById('nota-form').dataset.id = nota.id;
    mostrarFormularioNuevaNota();
}

// Función para eliminar una nota
function eliminarNota(idNota) {
    let notas = cargarNotas();
    notas = notas.filter(nota => nota.id !== idNota);
    guardarNotas(notas);
    toastr.success('Nota eliminada con éxito.');
    mostrarListaNotas(notas);
}