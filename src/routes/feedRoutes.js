const express = require('express');
const router = express.Router();

const feedController = require('../controllers/feedController');

router.get('/', feedController.get);

router.get('/sort', feedController.getSorted);

module.exports = router;