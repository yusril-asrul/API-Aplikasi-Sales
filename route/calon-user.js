const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validationResult = require('../utils/validationResult');
const { save, hapus, load, update_status, load_jns_follow_up, export_data } = require('../controller/calon-user');
const { nextAdd, nextEdit } = require("../utils/helper");

// Validate Request
const validationCalonUser = [
    body('nama_usaha').isString().withMessage('nama_usaha is required').notEmpty(),
    body('pemilik_usaha').isString().withMessage('pemilik_usaha is required').notEmpty(),
    body('nohp').isString().withMessage('nohp is required').notEmpty(),
    body('alamat').isString().withMessage('alamat is required').notEmpty(),
    body('lat').isString().withMessage('lat is required').notEmpty(),
    body('long').isString().withMessage('long is required').notEmpty(),
]

const validatorParamCalonUser = [
    param('id').isString().withMessage('id is required').notEmpty()
]

const validationCalonUserAdd = [
    ...validationCalonUser,
    body('foto').isString().withMessage('foto is required').notEmpty(),
]

const validationCalonUserEdit = [
    ...validationCalonUser,
    ...validatorParamCalonUser
]




// Router
router.post("/", validationCalonUserAdd, validationResult, nextAdd, save);
router.put("/:id", validationCalonUserEdit, validationResult, nextEdit, save);
router.delete("/:id", validatorParamCalonUser, validationResult, hapus);
router.get("/:id", load);
router.post("/load_list", load);
router.post("/stat_update", update_status);
router.post("/load_format_follow_up", load_jns_follow_up);
router.post("/export", export_data);

module.exports = router;