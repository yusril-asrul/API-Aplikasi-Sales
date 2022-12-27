const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validationResult = require('../utils/validationResult');
const {save} = require('../controller/calon-user');
const { nextAdd } = require("../utils/helper");

// Validate Request
const validationCalonUser = [
    body('nama_usaha').isString().withMessage('nama_usaha is required').notEmpty(),
    body('pemilik_usaha').isString().withMessage('pemilik_usaha is required').notEmpty(),
    body('nohp').isString().withMessage('nohp is required').notEmpty(),
    body('alamat').isString().withMessage('alamat is required').notEmpty(),
    body('lat').isString().withMessage('lat is required').notEmpty(),
    body('long').isString().withMessage('long is required').notEmpty(),
    body('foto').isString().withMessage('foto is required').notEmpty(),
]


// Router
router.post("/",validationCalonUser,validationResult,nextAdd,save);

module.exports = router;