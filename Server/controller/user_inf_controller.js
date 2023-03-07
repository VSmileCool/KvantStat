const user_info = require('../models/user_model')
const user_inf_service = require('../services/user_inf_service')
const {Op} = require('sequelize')

class UserController {

    async save_user_info(req, res) {

        try {

            const id = req.body.id
            const first_name = req.body.first_name
            const last_name = req.body.last_name
            const father_name = req.body.father_name
            const email = req.body.email
            const certificat = req.body.certificat
            const date_of_birthday = req.body.date_of_birthday

            const res_json = user_inf_service.save_user_info
            
            return res.json("[SUCCESS] USER INFO SAVED")

        } catch (e) {
            console.log(e)
            res.status(400).json({message: '[FAIL] ERROR WITH SAVING USER INFO'})
        }

    }

    async delete_user_info(req, res) {

        const id = req.body.id

        user_info.destroy({
            where: {id: id}
        })

        res.json("[SUCCESS] USER INFO DELETED")

    }

}

module.exports = new UserController();