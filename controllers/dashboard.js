import { Op } from "sequelize";
import customer from "../models/customer.js";
import letter from "../models/letter.js";
import mou from "../models/mou.js";
import user from "../models/user.js";

const allData = async function (req, res) {
    try {
        const userC = await user.findAll({
            where: {
                role: {
                    [Op.ne]: "admin",
                },
            },
        });
        const customerC = await customer.findAll();
        const mouC = await mou.findAll();
        const letterC = await letter.findAll();

        const result = {
            status: "ok",
            data: {
                sumKaryawan: userC.length,
                sumPelanggan: customerC.length,
                sumMou: mouC.length,
                sumSurat: letterC.length,
            },
        };

        res.json(result);
    } catch (error) {
        print(error);
    }
};

export { allData };
