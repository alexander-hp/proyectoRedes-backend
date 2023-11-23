/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  validarJWT,
  validarOWNER_ROLE,
  validarOWNER_ROLE_o_MismoUsuario,
  validarOWNER_ROLE_o_Admin,
  validarNoUsuario,
} = require('../middlewares/validar-jwt');
const { createTransaction } = require('../controllers/transactions');
const {
  createBankAccount,
  getBankAccount,
  getBankAccounts,
} = require('../controllers/bankAccount');

const router = Router();

// router.get('/search/', validarJWT, searchUser);

router.get(
  '/:id',
  validarJWT,

  getBankAccount
);

router.get('/', validarJWT, getBankAccounts);

router.post(
  '/',
  [
    validarJWT,
    check('userId', 'Num. de usuario obligatorio').not().isEmpty(),
    validarCampos,
  ],
  createBankAccount
);

// router.put(
//   '/:id',
//   [
//     validarJWT,
//     validarOWNER_ROLE_o_Admin,
//     check('name', 'El nombre es obligatorio').not().isEmpty(),
//     check('email', 'El email es obligatorio').isEmail(),
//     check('role', 'El role es obligatorio').not().isEmpty(),
//     validarCampos,
//   ],
//   actualizarUsuario
// );

// router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
