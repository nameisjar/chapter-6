const router = require('express').Router();
const { image } = require('../libs/multer');
const { createImage, getAllImage, getDetailImage, deleteImage, updateImage } = require('../controllers/media.controllers');

router.post('/image', image.single('image'), createImage);
router.get('/image', getAllImage);
router.get('/image/:id', getDetailImage);
router.delete('/image/:id', deleteImage);
router.put('/image/:id', image.single('image'), updateImage);

module.exports = router;