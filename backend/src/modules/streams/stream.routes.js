// Stream Routes
const express = require('express');
const StreamController = require('./stream.controller');
const validateRequest = require('../../middlewares/validate.middleware');
const StreamValidation = require('./stream.validation');

const router = express.Router();

router.get('/', StreamController.getAllStreams);
router.get('/:id', StreamController.getStreamById);
router.post('/', validateRequest(StreamValidation.createSchema), StreamController.createStream);
router.put('/:id', validateRequest(StreamValidation.updateSchema), StreamController.updateStream);
router.delete('/:id', StreamController.deleteStream);

module.exports = router;
