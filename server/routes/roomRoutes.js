const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', roomController.getRooms);
router.post('/', protect, roomController.createRoom);
router.get('/:id', protect, roomController.getRoomById);
router.post('/:id/join-check', protect, roomController.joinRoomCheck);
router.delete('/:id', protect, roomController.deleteRoom);

module.exports = router;
