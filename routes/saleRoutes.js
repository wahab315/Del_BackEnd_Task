
const express = require('express');
const saleController = require('../controllers/saleController');
const catchAsync = require('../utils/catchAsync');
const Authorization = require('../middlewares/protect');

const router = express.Router();
 
router.post('/',
Authorization.protect,
saleController.uploadSaleImages,
saleController.resizeSaleImages,
saleController.createSale
);

router.get('/',
saleController.allSale
);

module.exports = router;
