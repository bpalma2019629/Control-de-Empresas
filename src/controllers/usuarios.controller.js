const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const md_autenticacion = require('../middlewares/autenticacion');

//Login

function Login(req, res){
    var parametros = req.body;

    Usuarios.findOne({usuario: parametros.usuario}, (err, usuarioEncontrado) =>{
        if(err) return res.status(500).send({mensaje:"Error en la peticion"});
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword)=>{
                if(verificacionPassword){
                    if(parametros.obtenerToken === 'true'){
                        return res.status(200).send({token: jwt.crearToken(usuarioEncontrado)})
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuario: usuarioEncontrado})
                    }
                }else{
                    return res.status(500).send({mensaje: 'la pasword no coincide'})
                }
            })

        }else{
            return res.status(500).send({mensaje:"Error, usuario no se encuentra registrado"})
        }
    })
}

//Registrar

function UsuarioInicial(){
    var usuariosModels = new Usuarios();

        usuariosModels.nombre = 'Administrador';
        usuariosModels.usuario = 'ADMIN';
        usuariosModels.rol = 'Rol_Admin';

        Usuarios.find((err, usuarioEncontrado)=> {
            if(usuarioEncontrado.length == 0){

                bcrypt.hash('123456', null, null, (err, paswordEncriptada)=>{
                    usuariosModels.password = paswordEncriptada;
                });
                usuariosModels.save()
            }
        })
}

function RegistrarEmpresas(req, res){
    var parametros = req.body;
    var usuariosModels = new Usuarios();

    if(req.user.rol == 'Rol_Admin'){
        if(parametros.nombre,parametros.usuario, parametros.password){
            usuariosModels.nombre = parametros.nombre;
            usuariosModels.usuario = parametros.usuario;
            usuariosModels.rol = 'Rol_Empresa';
    
            Usuarios.find({usuario: parametros.usuario}, (err, usuarioEncontrado)=> {
                if(usuarioEncontrado.length == 0){
    
                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada)=>{
                        usuariosModels.password = passwordEncriptada;
                    });
                    usuariosModels.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje:"Error en la peticion"});
                        if(!usuarioGuardado) return res.status(400).send({mensaje:"Error al agregar la empresa"});
                        return res.status(200).send({usuario: usuarioGuardado});
                    })
                } else {
                    return res.status(500).send({mensaje: 'Este usuario ya se encuentra utilizado'})
                }
            })
        }
    }else{
        return res.status(500).send({ mensaje: "No esta Autorizado para crear una empresa" });
    }
}

//Editar

function EditarEmpresa(req,res){
    var idEmp = req.params.idEmpresa;
    var parametros = req.body;

    if(idEmp === req.user.sub || req.user.rol == 'Rol_Admin'){
        Usuarios.findByIdAndUpdate(idEmp, parametros,{new:true}, (err, empresaEditada) =>{
            if (err) return res.status(500).send({mensaje:'Error en la peticion'});
            if (!empresaEditada) return res.status(404).send({mensaje: 'Error al Editar la empresa'})
            return res.status(200).send({empresa: empresaEditada});
        })
    }else{
        return res.status(500).send({mensaje: 'no esta autorizado para editar'});
    }
}

///Eliminar

function EliminarEmpresa(req,res){
    var idEmp = req.params.idEmpresa;
    if(idEmp === req.user.sub || req.user.rol == 'Rol_Admin'){
        Usuarios.findByIdAndDelete(idEmp, (err, empresaEliminada) =>{
            if (err) return res.status(500).send({mensaje:'Error en la peticion'});
            if (!empresaEliminada) return res.status(404).send({mensaje: 'Error al Eliminar la empresa'})
            return res.status(200).send({empresa: empresaEliminada});
        })
    }else{
        return res.status(500).send({mensaje: 'No esta autorizado para eliminar'});
    }  
}

//Exports 

module.exports = {
    Login,
    RegistrarEmpresas,
    UsuarioInicial,
    EditarEmpresa,
    EliminarEmpresa
}