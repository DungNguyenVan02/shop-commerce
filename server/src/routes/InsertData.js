const express = require("express");

const insertData = require("../controllers/InsertData");
const router = express.Router();

router.post("/", insertData.insertProduct);
router.post("/cate", insertData.insertCategory);

module.exports = router;
