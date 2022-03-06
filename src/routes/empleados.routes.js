const express = require('express');
const emleadosController = require('../controllers/empleados.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api= express.Router();

api.get('/cantidadEmpleados', md_autenticacion.Auth, emleadosController.cantidadEmpleados);
api.get('/obtenerEmpleados', md_autenticacion.Auth, emleadosController.ObtenerEmpleados);
api.get('/obtenerEmpleadoPorId/:idEmpleado', md_autenticacion.Auth, emleadosController.ObtenerEmpleadoPorId);
api.get('/obtenerEmpleadoPorNombre', md_autenticacion.Auth, emleadosController.obtenerEmpleadoPorNombre);
api.get('/obtenerEmpleadoPorPuesto', md_autenticacion.Auth, emleadosController.obtenerEmpleadoPorPuesto);
api.get('/obtenerEmpleadoPorDepartamento', md_autenticacion.Auth, emleadosController.obtenerEmpleadoPorDepartamento);
api.post('/registrarEmpleado',md_autenticacion.Auth, emleadosController.RegistrarEmpleados);
api.put('/editarEmpleado/:idEmpleado',md_autenticacion.Auth, emleadosController.EditarEmpleado);
api.delete('/eliminarEmpleado/:idEmpleado',md_autenticacion.Auth, emleadosController.EliminarEmpleado);
api.get('/pdfEmpleados',md_autenticacion.Auth, emleadosController.crearPdf);
api.get('/excelEmpleados',md_autenticacion.Auth, emleadosController.crearExcel);

module.exports = api;