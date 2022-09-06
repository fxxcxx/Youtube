const express = require('express');
const router = express.Router();
// const {Video} = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
    destination: (req, file, cb) => { //파일을 어디에 저장할지
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
    const fileFilter= (req, file, cb) => {
        if(file.mimetype == 'video/mp4') {    
        cb(null, true);
        }
        else{
            cb({msg:'only jpg, png, mp4 is allowed'}, false);
        }
    }

const upload = multer({ storage: storage, fileFilter:fileFilter}).single("file");
const path = require('path');

//=================================
//             Video
//=================================

router.post("/uploads", (req, res) => {

    upload(req, res, err => {
    if(err){
        return res.json({success: false, err})
    }
    else{
    return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
}

})


router.post("/thumbnail", (req, res) => {

    //썸네일 생성, 비디오 정보 출력(러닝타임)
    let filePath = ""
    let fileDuration = ""

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function (filenames){
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end',function(){
        console.log("Screenshots taken");
        return res.json({success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err});
    })
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',

        filename: 'thumbnail-%b.png'
    })
})

});




module.exports = router;
