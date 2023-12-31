const Router = require('express')
const router = new Router()
const roomsController = require('../controller/rooms.controller')

router.post('/book-room/', roomsController.bookRoom)
router.post('/unbook-room/', roomsController.unbookRoom)
router.post('/login/', roomsController.login)
router.get('/upcoming-books/', roomsController.upcomingBooks)

module.exports = router

