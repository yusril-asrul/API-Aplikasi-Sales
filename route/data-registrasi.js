const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validationResult = require('../utils/validationResult');
const { load, update_status, update_demo, load_aktfitas, simpan_aktifitas, hapus_aktiftas, update_status_aktifitas} = require('../controller/data-registrasi');
const { nextAdd, nextEdit } = require("../utils/helper");

const validatorAktifitas = [
    param('id').isString().withMessage('id is required').notEmpty()
]

// Router
router.get("/:id",load);
router.post("/load_list",load);
router.post("/stat_update", update_status);
router.post("/update_demo", update_demo);
router.post("/load_aktvitas", load_aktfitas);
router.post("/simpan_aktivitas", simpan_aktifitas);
router.post("/hapus_aktivitas", hapus_aktiftas);
router.post("/update_status_aktifitas", update_status_aktifitas);

module.exports = router;