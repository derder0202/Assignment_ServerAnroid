const mongoose = require('mongoose')

const detailImageSchame = mongoose.Schema({
    title:{
      type:String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    sdUrl: {
        type: String
    },
})

let DetailImage = mongoose.model("DetailImage",detailImageSchame)

module.exports = {DetailImage}
