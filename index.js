import express from 'express'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import _ from 'lodash'
import chalk from 'chalk';

moment.locale('es')

// constantes y variables
const app = express();
let usuarios = []



//Crear las rutas, routing. aCompuesto por dos argumentos, string y callback 
app.get('/usuarios', (req, res) => {
    axios.get('https://randomuser.me/api/')
        .then(response => {
            const firstName = response.data.results[0].name.first; 
            const lastName = response.data.results[0].name.last;
            const gender = response.data.results[0].gender;

            const nuevoUsuario = {
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                id: uuidv4().slice(0, 15),
                timestamp: moment().format('MMMM, DD, YYYY HH:mm:ss')
            }
            usuarios.push(nuevoUsuario);
            const usuariosPorGenero = getUsuariosPorGenero(usuarios); 
            const UsuariosPorGenero = mostrarUsuariosPorGenero(usuariosPorGenero);
            res.send(UsuariosPorGenero);
            console.log(chalk.bgWhite.blue(UsuariosPorGenero));
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });

})


//funciones obtener y mostrar usuarios
function getUsuariosPorGenero(usuarios) {
    const usuariosPorGenero = _.groupBy(usuarios, 'gender');
    for (const genero in usuariosPorGenero) {
        if (genero === 'male') {
            usuariosPorGenero['Hombre'] = usuariosPorGenero[genero];
            delete usuariosPorGenero[genero];
        } else if (genero === 'female') {
            usuariosPorGenero['Mujer'] = usuariosPorGenero[genero];
            delete usuariosPorGenero[genero];
        }
    }
    return usuariosPorGenero;
}


function mostrarUsuariosPorGenero(usuariosPorGenero) {
    let mostrarUsuarios = '';

    // Obtener los géneros
    const generos = Object.keys(usuariosPorGenero);
    // Recorrer los géneros
    generos.forEach(genero => {
        const usuariosDelGenero = usuariosPorGenero[genero]; // Obtener la lista de usuarios
        mostrarUsuarios += `<h2>${genero}</h2>`;
        usuariosDelGenero.forEach(usuario => {
            const infoUsuario = `Nombre: ${usuario.firstName} - Apellido ${usuario.lastName} - ID: ${usuario.id} - Fecha: ${usuario.timestamp}`;
            mostrarUsuarios += `<p>${infoUsuario}</p>`;
        });
    });
    return mostrarUsuarios;
}

//Levantar servidor
app.listen(3000, () => console.log('El servidor está arriba en el puerto 3000'))

//separar con lodash en hoombre y mujer
// debo dejar esto en un array de usuarios y crearlos con un push



