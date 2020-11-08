//Practica de alta y lectura de local storage
const formUser = document.getElementById('formUser');
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const temaInput = document.getElementById('tema');
const fechaInput = document.getElementById('fecha');
const tituloInput = document.getElementById('titulo');
const notaInput = document.getElementById('nota');
const usersUl = document.getElementById('userList');
const usersTable = document.getElementById('usersTable');
const emailModalInput = document.getElementById('emailModal');
const fechaModalInput = document.getElementById('fechaModal');
const temaModalInput = document.getElementById('temaModal');
const formEdit = document.getElementById('formEdit');
let editUserId = '';
const search = document.getElementById('search');
const searchForm = document.getElementById('searchForm');

//Generador de ID unico.
const generateId = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

formUser.onsubmit = (e) => {
    e.preventDefault();
    //Traer la lista de usuarios de local storage,
    // y el valor por defecto en caso que no exista.
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const email = emailInput.value;
    const name = nameInput.value;
    const tema = temaInput.value;
    const fecha = fechaInput.value;
    const titulo = tituloInput.value;
    const nota = notaInput.value;

    //Agregar un objeto usuario al arreglo.
    users.push({
        name: name,
        email: email,
        tema: tema,
        fecha: fecha,
        titulo: titulo,
        nota: nota,
        id: generateId(),
        createdAt: Date.now(),
    })
    //Guardar lista de usuarios en localStorage.
    const usersJson = JSON.stringify(users);
    localStorage.setItem('users', usersJson);
    //Mostrar en consola los datos del arreglo.
    console.log("formUser.onsubmit -> users", users)
    //Limpiar todos los campos del formulario con reset.
    formUser.reset();
    //Alert al apretar el boton.
    alert("¡Recibido! \n Sus datos fueron ingresados correctamente a nuestra base de datos.");
    //Agregar la lista debajo.
    displayAllUsers();
}

const getModal = (user) => {
    //Esta funcion devuelve el modal con todos los datos del usuario.
    const createdAt = new Date(user.createdAt);
    return `
    <!-- Button trigger modal -->
                <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal${user.id}"><i class="fas fa-list-ul"></i></i></button>
                <!-- Modal -->
                <div class="modal fade" id="modal${user.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">${user.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>Nombre: ${user.name}.</p>
                                <p>Email: ${user.email}.</p>
                                <p>Fecha: ${user.fecha}.</p>
                                <p>Tema: ${user.tema}.</p>
                                <p>Fecha de registro: ${createdAt.toLocaleString()}.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
    `
}

const loadForm = (userId) => {
    //Mostrar datos del usuario seleccionado, en los campos del formulario.
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.id == userId);
    emailModalInput.value = user.email;
    fechaModalInput.value = user.fecha;
    temaModalInput.value = user.tema;
    editUserId = userId;
}

//Función para agregar debajo los datos ingresados en los inputs.
function displayUser(users) {
    const rows = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const tr = `
        <div class="card border-primary mb-3" style="max-width: 18rem;">
            <div class="card-header bg-transparent border-success"><strong>${user.name || ''}</strong> / <strong>${user.tema || ''}</strong></div>
            <div class="card-body text-dark">
                <h5 class="card-title"><strong>Titulo:</strong> ${user.titulo || ''}.</h5>
                <p class="card-text">${user.nota || ''}</p>
            </div>
            <div class="card-footer bg-transparent border-success">Para el día: ${user.fecha || ''}.</div>
                ${getModal(user)}
                <!-- Button trigger modal edit -->
                <button type="button" class="btn btn-warning text-white" data-toggle="modal" data-target="#editModal" onclick="loadForm('${user.id}')"><i class="fas fa-user-edit"></i></button>
                <button onclick="deleteUser('${user.id}')" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
        `
        //Agregamos el string de la fila al array rows.
        rows.unshift(tr)
    }
    //Unimos todas las filas en un solo string con join
    // y lo insertamos en el contenido de la tabla.
    usersTable.innerHTML = rows.join('')
}

function displayAllUsers() {
    // Esta función muestra la lista completa de usuarios en la tabla.

    // Traer la lista de usuarios de localStorage,
    // sino existe la clave 'users', devuelve un arreglo vacío.
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Llamar a la función displayUsers, pasando por parámetros la lista completa de usuarios.
    displayUser(users);
    console.log("Se cargó la lista completa de usuarios en la tabla.");
}

//Función borrar:
function deleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const filteredUsers = users.filter((user) => user.id !== userId);
    const usersJson = JSON.stringify(filteredUsers);
    //Alert al apretar el boton.
    alert("¡Dato borrado!");
    localStorage.setItem('users', usersJson);
    displayAllUsers();
}

formEdit.onsubmit = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const email = emailModalInput.value;
    const fecha = fechaModalInput.value;
    const tema = temaModalInput.value;
    // Incluimos una variable nueva que guarda la fecha de modificación,
    // para agregarla al objeto del usuario modificado.
    const updatedAt = Date.now();

    //Actualizar un usuario del array usuarios, usando map() y spread syntax.
    const updatedUsers = users.map((u) => {
        if (u.id == editUserId) {
            //usar spread sintax para copiar las propiedades de un objeto a otro.
            const user = {
                ... u,
                email: email,
                fecha: fecha,
                tema: tema,
            }
            return user
        } else {
            return u;
        }
    })
    //Guardar lista de usuarios en LocalStorage.
    const usersJson = JSON.stringify(updatedUsers);
    localStorage.setItem('users', usersJson);
    formEdit.reset();
    alert("Usuario modificado satisfactoriamente.");
    console.log("Usuario modificado satisfactoriamente.");
    displayAllUsers();
    // Ocultar el modal con las funciones incluidas en jQuery.
    $('#editModal').modal('hide');
}

searchForm.onsubmit = (e) => {
    // Al evento submit de la barra de búsqueda le asignamos esta función,
    // que filtra y muestra los usuarios que coinciden con la búsqueda.

    e.preventDefault();
    // Guardar en una variable la lista completa de usuarios.
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Transformar en minúsculas la palabra buscada y guardarla en una variable.
    const term = search.value.toLowerCase();
    console.log("term", term);
    // Guardar el array resultante de aplicar el método filter sobre el array de usuarios,
    // filtrando para obtener solo los que incluyen la palabra buscada.
    const filteredUsers = users.filter((u) => (
        // Usar el método toLowerCase() para transformar el nombre y apellido a minúscula,
        // y el método includes() que evalúa si se incluye o no la palabra buscada.
        u.name.toLowerCase().includes(term) || u.name.toLowerCase().includes(term)|| u.tema.toLowerCase().includes(term)
    ))
    // Llamar a la función displayUsers, pasando por parámetros la lista filtrada de usuarios.
    displayUsers(filteredUsers);
        console.log(`Lista de usuarios cargados. ${filteredUsers.length} resultados encontrados.`);
}

let timeOutID;
search.oninput = () => {
    // Al evento oninput del campo de búsqueda le asignamos esta función,
    // que será llamada cada vez que se presione una tecla,
    // y que filtra y muestra los usuarios que coinciden con la búsqueda, con un delay o debounce de 1seg.

    // Cancelar la ejecución de la función declarada en el setTimeOut(),
    // con el identificador guardado en la variable timeOutID.
    clearTimeout(timeOutID);

    // Demorar la ejecución de la búsqueda con la función setTimeOut(),
    // esta recibe dos parámetros, la función deberá ejecutar y el tiempo de espera en mili-segundos.
    timeOutID = setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const term = search.value.toLowerCase();
        console.log("term", term)
        const filteredUsers = users.filter(u => (
            u.name.toLowerCase().includes(term) || u.name.toLowerCase().includes(term)|| u.tema.toLowerCase().includes(term)
        ))
        displayUser(filteredUsers);
        console.log(`Se cargó la lista filtrada de usuarios en la tabla. ${filteredUsers.length} resultados encontrados.`);
    }, 1000);
}

displayAllUsers();
