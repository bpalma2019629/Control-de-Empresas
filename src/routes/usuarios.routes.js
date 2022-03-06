const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();


api.post('/registrarEmpresa',md_autenticacion.Auth, usuariosController.RegistrarEmpresas);
api.post('/login', usuariosController.Login);
api.put('/editarEmpresa/:idEmpresa',md_autenticacion.Auth, usuariosController.EditarEmpresa);
api.delete('/eliminarEmpresa/:idEmpresa',md_autenticacion.Auth, usuariosController.EliminarEmpresa);

module.exports = api;