const adminService = require('../services/admin.service')

class AdminController {
    async new_certificate(req, res)
    {
        try {
            const release_date = req.body.release_date
            const name = req.body.name
            const surname = req.body.surname
            const patronymic = req.body.patronymic
            const cert = await adminService.new_certificate(release_date, name, surname, patronymic)
            console.log(cert)
            return res.status(200).json(cert)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка в регистрации сертификата'})
        }
    }

    async login(req, res)
    {
        try{
            const {login, password} = req.body
            const admData = await AdminService.login(login, password);
            return res.json(admData);
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибк'})
        }
    }
}


module.exports = new AdminController()