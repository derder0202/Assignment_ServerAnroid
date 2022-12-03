var express = require('express');
var router = express.Router();
const {DetailImage} = require("../model/model");

/* GET home page. */
router.get('/:id', async function(req, res, next) {
    const image = await DetailImage.findById(req.params.id)
    console.log(image)
    res.render('updateImage',{img:image});
});



module.exports = router;
