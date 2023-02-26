const userService = require('../services/user.service')

class userController{
    async getUser(req, res, next){
        try {
            const id = req.body.id
            const userData = userService.getUser(id)
            res.status(200).json(userData)
        }catch (e){
            next(e)
        }
    }
}

module.exports = new userController()