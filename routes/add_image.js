var express = require('express');
var router = express.Router();
var imageController = require('../controller/ImageController')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('addImage');
});

//Add image
router.post('/',imageController.addImage)



module.exports = router;
