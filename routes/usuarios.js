/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  getUser,
  searchUser,
} = require('../controllers/usuarios');
const {
  validarJWT,
  validarOWNER_ROLE,
  validarOWNER_ROLE_o_MismoUsuario,
  validarOWNER_ROLE_o_Admin,
  validarNoUsuario,
} = require('../middlewares/validar-jwt');

const router = Router();

router.get('/search/', validarJWT, searchUser);

router.get('/:id', validarJWT, validarOWNER_ROLE_o_MismoUsuario, getUser);

router.get('/', validarJWT, getUsuarios);

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('phone', 'El phone es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.put(
  '/:id',
  [
    validarJWT,
    validarOWNER_ROLE_o_Admin,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
