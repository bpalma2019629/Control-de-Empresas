const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuarios.routes');
const EmpleadosRutas = require('./src/routes/empleados.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, EmpleadosRutas);

module.exports = app;