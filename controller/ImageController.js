const {DetailImage} = require("../model/model")
let alert = require('alert')
const multer = require('multer')
const sharp = require('sharp');
var sizeOf = require('image-size');

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.'+file.mimetype.toString().split("/")[1])
    }
})
const path = require("path");

const checkFileType = function (file, cb) {
//Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;

//check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb("Error: You can Only Upload Images!!");
    }
};
const upload2 = multer({ storage: storage,
    fileFilter: (req,file, cb) =>{
        checkFileType(file,cb)
    }
}).single("image")

const imageController = {
    addImage: async (req,res) =>{
        try{
           // console.log(`${req.protocol + '://' + req.get('host')}/listImage/file/${req.file.filename}`)
            let url
            let sdUrl
            upload2(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    alert('Định dạng file phải là ảnh')
                } else if (err) {
                    // An unknown error occurred when uploading.
                }

                url = `${req.protocol + '://' + '192.168.0.215:3000'}/listImage/file/${req.file.filename}`
                sizeOf( './uploads/'+ req.file.filename, function (err, dimensions) {
                    console.log(dimensions.width, dimensions.height);
                    sharp(req.file.path).resize(Math.round(dimensions.width/2), Math.round(dimensions.height/2)).toFile('./uploads/'+ 'sd-'+req.file.filename, function(err) {
                        if (err) {
                            console.error('sharp>>>', err)
                        }
                        sdUrl= `${req.protocol}://${req.get('host')}/listImage/file/sd-${req.file.filename}`
                        const newImage = new DetailImage({url,sdUrl,...req.body})
                        newImage.save()
                        res.redirect('/addImage')
                        alert("Thêm thành công")
                    })
                });
            })
        }catch (e){
            res.status(500).json(e)
        }
    },
    getAnImage: async (req,res) => {
        try{
            res.sendFile(path.resolve(`uploads/${req.params.imageName}`));
        }catch (e){
            res.status(500).json(e)
        }
    },
    deleteAnImage: async (req,res) => {
        try{
            await DetailImage.findByIdAndDelete(req.params.id)
            //res.status(200).json("deleted")
            res.redirect('/listImage/1')
            alert("Deleted")
        }catch (e){
            res.status(500).json(e)
        }
    },
    updatePage: async (req,res) => {
        const image = await DetailImage.findById(req.params.id)
        res.render('updateImage',{img:image});
    },
    updateAnImage: async (req,res) => {
        try{
            const image = await DetailImage.findById(req.params.id)
            await image.updateOne({
                $set:{
                    title: req.body.title,
                    description: req.body.description,
                    date:req.body.date
                }
            })
            //res.status(200).json("updated an image successfully")
            res.redirect('/listImage/1')
            alert("Updated")
        } catch (e) {
            res.status(500).json(e);
        }

    },
    getImageByPage: async (req,res, next) => {
        let page = req.params.page || 1;
        const perPage = 4;
        DetailImage.find()
            .skip(perPage*page - perPage)
            .limit(perPage)
            .exec((err,imgs) =>{
                DetailImage.countDocuments((err,count) => {
                    if (err) return res.status(500).json(err);
                    res.render('listImgByPage',{data: imgs,page: parseInt(page)});
                })
            })
    },
    getDataImageByPage: async (req,res) => {
        try{
            let page = req.params.page || 1;
            const perPage = 12;
            DetailImage.find()
                .skip(perPage*page - perPage)
                .limit(perPage)
                .exec((err,imgs) =>{
                    DetailImage.countDocuments((err,count) => {
                        if (err) return res.status(500).json(err);
                        res.status(200).json(imgs)
                    })
                })
            console.log( req.protocol + '://' + req.get('host') + req.originalUrl)

        } catch (e) {
            res.status(500).json(e);
        }

    },
    getCountDocument: async (req,res) => {
        const length = await DetailImage.countDocuments()
        res.status(200).json(length)
    }
}

module.exports = imageController