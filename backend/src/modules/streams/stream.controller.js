// Stream Controller
const asyncHandler = require('../../utils/asyncHandler');
const ResponseFormatter = require('../../utils/responseFormatter');
const StreamService = require('./stream.service');

const StreamController = {
  getAllStreams: asyncHandler(async (req, res) => {
    const streams = await StreamService.getAllStreams();
    res.status(200).json(ResponseFormatter.success(streams));
  }),

  getStreamById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const stream = await StreamService.getStreamById(id);
    if (!stream) {
      return res.status(404).json(ResponseFormatter.error('Stream not found'));
    }
    res.status(200).json(ResponseFormatter.success(stream));
  }),

  createStream: asyncHandler(async (req, res) => {
    const stream = await StreamService.createStream(req.body);
    res.status(201).json(ResponseFormatter.success(stream, 'Stream created successfully'));
  }),

  updateStream: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const stream = await StreamService.updateStream(id, req.body);
    if (!stream) {
      return res.status(404).json(ResponseFormatter.error('Stream not found'));
    }
    res.status(200).json(ResponseFormatter.success(stream, 'Stream updated successfully'));
  }),

  deleteStream: asyncHandler(async (req, res) => {
    await StreamService.deleteStream(req.params.id);
    res.status(200).json(ResponseFormatter.success(null, 'Stream deleted successfully'));
  }),
};

module.exports = StreamController;
