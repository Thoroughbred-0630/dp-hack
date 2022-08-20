const express = require("express");
const router = express.Router();
const {    
    getGoogleAPIScript,
} = require("../controllers/setting");

router.get("/", getGoogleAPIScript);

module.exports = router;