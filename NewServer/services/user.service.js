const user_model = require('../models/user.model')
const tokenService = require('./token.service')
const ApiError = require('../errors');

class UserService{
    async getUser(id){
        try {
            const user = user_model.findOne(id)
            console.log(user)
            return {user}
        }catch (e){
            console.log('ошиииибка')
        }
    }
}

module.exports = new UserService()