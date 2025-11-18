const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const validationResult = require('../utils/validationResult');
const { load, update_status, update_demo, load_aktfitas, simpan_aktifitas, hapus_aktiftas, update_status_aktifitas, load_kebutuhan, simpan_kebutuhan, hapus_kebutuhan, load_all_user} = require('../controller/data-registrasi');
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

router.post("/load_kebutuhan", load_kebutuhan);
router.post("/simpan_kebutuhan", simpan_kebutuhan);
router.post("/hapus_kebutuhan", hapus_kebutuhan);
router.post("/load_all_user",load_all_user);

module.exports = router;