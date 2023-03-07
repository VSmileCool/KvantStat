const token_model = require('../models/token.model')
const jwt = require('jsonwebtoken')

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, "qwer", {expiresIn:'3m'})
        const refreshToken = jwt.sign(payload, 'qwert', {expiresIn:'3m'})
        return{
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await token_model.findOne({where:{userUserId:userId}})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            tokenData.save()
        }
        const token = await token_model.create({userUserId:userId, refreshToken})
        return token
    }

    async saveAdmToken(userId, refreshToken){
        const tokenData = await token_model.findOne({where:{userUserId:userId}})
        if(tokenData){
            tokenData.refreshToken = refreshToken
            tokenData.save()
        }
        const token = await token_model.create({userUserId:userId, refreshToken})
        return token
    }

    async removeToken(){
        
    }

    validateAccessToken(token) {
        try {
            console.log(token)
            //process.env.JWT_ACCESS_SECRET
            const userData = jwt.verify(token, "qwer");
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            //process.env.JWT_REFRESH_SECRET
            const userData = jwt.verify(token, 'qwer');
            return userData;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService