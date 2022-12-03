var express = require('express');
var router = express.Router();
var imageController = require('../controller/ImageController')
const {DetailImage} = require("../model/model");

/* GET home page. */
router.get('/', async function(req, res, next) {
    const listImage = await DetailImage.find()
    res.status(200).json(listImage)
    //res.status(200).json(listImage)
});

router.get('/length',imageController.getCountDocument)

//Get An Image
router.get('/file/:imageName',imageController.getAnImage)

// delete an image
router.get('/delete/:id',imageController.deleteAnImage)
//update an image
router.get('/updatePage/:id',imageController.updatePage)
router.post('/update/:id',imageController.updateAnImage)


router.get('/:page',imageController.getImageByPage)
router.get('/page/:page',imageController.getDataImageByPage)

router.post('/fakeData', async (req,res)=>{
    try{
        for(let i=0;i<5;i++){
            const imageModel = new DetailImage({
                title: `anh ${i}`,
                description: `anh ${i}`,
                url: "https://via.placeholder.com/600/92c952",
                sdUrl: "https://via.placeholder.com/600/92c952",
            })
            imageModel.save()
        }
        res.status(200).json("fake thanh cong")
    } catch (e){
        res.status(500).json(e);
    }
})



module.exports = router;
