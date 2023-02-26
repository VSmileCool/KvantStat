const user = require("../models/user.model");
const { Op } = require("sequelize");

class CertificateController {
  async save_certificate(req, res) {
    try {
      const certificate_code = req.body.certificate;
      const certificate_mb = await user.findOne({
        where: { certificate: certificate },
      });
      if (certificate_mb) {
        const allCetrificateLikeIts = await certificate.findAndCountAll({
          where: { certificate_id: { [Op.like]: `%${certificate_code}%` } },
        });
        console.log(allCetrificateLikeIts.count);
        const countPlusOnew = allCetrificateLikeIts.count + 1;
        const newCetrificate = certificate_code + countPlusOnew;
        const cert = new certificate({ certificate_id: newCetrificate });
        await cert.save();
        return res.json({
          message:
            "Такой сертификат уже есть. Новый сертификат записан с цифрой " +
            countPlusOnew +
            " на конце",
        });
      }
      const cert = new certificate({ certificate_id: certificate_code });
      await cert.save();
      return res.json({ message: "Сертификат записан!" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка в регистрации сертификата" });
    }
  }
}

module.exports = new CertificateController();
