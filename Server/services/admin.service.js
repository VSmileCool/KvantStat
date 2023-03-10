const certificate_model = require('../models/cetrificate.model')
const admin_model = require('../models/admin.model')
const token_service = require('../services/token.service')
const UserDto = require('../dtos/user.dto')
const CryptoJs = require('crypto-js')

class AdminService{
    async login(login, password){
        const adm = await admin_model.findOne({login})
        console.log(adm)
        if (!adm) {
            res.status(400).json({message: 'Ошибк в имени'})
        }
        if (!password){
            res.status(400).json({message: 'Ошибк в пароле'})
        }
        const userDto = new UserDto(login, "1");
        // const tokens = toker_service.generateTokens({...userDto});

        // console.log(tokens)
        // await toker_service.saveToken(userDto.id, tokens.refreshToken);
        return userDto
    }

    async new_certificate(release_date, name, surname, patronymic) {

            const certificate = release_date + " " + name + " " + surname + " " + patronymic
            console.log(typeof(certificate), certificate)
            const secret = "q"

            const encrypt_certificate_code = CryptoJs.AES.encrypt(certificate, secret).toString();
            
            const bytes_decrypt_certificate = CryptoJs.AES.decrypt(encrypt_certificate_code.toString(), secret)
            var decrypt_certificate = bytes_decrypt_certificate.toString(CryptoJs.enc.Utf8);
            console.log("encrypt certiificate - ", encrypt_certificate_code.toString())
            console.log('decrypt certificate - ', decrypt_certificate)

            const certificate_mb = await certificate_model.findOne({where:{certificate_id: encrypt_certificate_code}})
            if (certificate_mb) {
                const allCetrificateLikeIts = await certificate_model.findAndCountAll({where:{certificate_id: {[Op.like]:`%${encrypt_certificate_code}%`}}})
                console.log(allCetrificateLikeIts.count)
                const countPlusOnew = allCetrificateLikeIts.count + 1
                const newCetrificate = encrypt_certificate_code + countPlusOnew
                const cert = new certificate_model(
                     {certificate_id: newCetrificate}
                )
                await cert.save()
                return cert
            }
            const cert = new certificate_model(
                {certificate_id: encrypt_certificate_code}
            )
            await cert.save()
            return cert
    }
}

module.exports = new AdminService