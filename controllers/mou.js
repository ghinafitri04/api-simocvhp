// const { where } = require("sequelize");
// const mou = require("../models/mou");
// const multer = require("multer");
import mou from "../models/mou.js";
import multer from "multer";
import customer from "../models/customer.js";

const mouStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/mou");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
    },
});

//filter untuk pdf
const fileFilter = function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// penggunaan multer
const multerMou = multer({
    storage: mouStorage,
    fileFilter: fileFilter,
}).single("mouFile");

const allMou = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Mengambil nomor halaman dari query parameter, defaultnya adalah halaman 1
        const perPage = parseInt(req.query.perPage) || 10; // Mengambil jumlah data per halaman dari query parameter, defaultnya adalah 10

        const { count, rows } = await mou.findAndCountAll({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: ["customer_name", "company_name"],
                },
            ],
            limit: perPage, // Mengambil data sebanyak perPage
            offset: (page - 1) * perPage, // Menghitung offset untuk memulai pengambilan data
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tidak ada data Mou" });
        }

        const result = {
            status: "ok",
            count: count, // Jumlah total data keseluruhan
            data: rows.map((item) => ({
                ...item.toJSON(),
                file_url: item.file_url,
            })),
            pagination: {
                currentPage: page, // Nomor halaman saat ini
                perPage: perPage, // Jumlah data per halaman
                totalPages: Math.ceil(count / perPage), // Jumlah total halaman
            },
        };

        res.json(result);
    } catch (error) {
        console.error(
            "Terjadi kesalahan saat mengambil data Mou:",
            error.message
        );
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data Mou",
        });
    }
};

const getMouById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await mou.findOne({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: ["customer_name", "company_name"],
                },
            ],
            where: { id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `mou dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data.map((item) => ({
                ...item.toJSON(),
                file_url: item.file_url,
            })),
        });
    } catch (error) {
        console.log("<<< Terjadi Kesalahan, tidak dapat menampilkan mou >>>");
    }
};

const addMou = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(422).json({
                status: "failed",
                message: `File MoU harus di upload`,
            });
        }

        const { customerId, startDate, endDate } = req.body;
        const mouFile = req.file.path;

        const newMou = await mou.create({
            start_date: startDate,
            finish_date: endDate,
            mou_file: mouFile,
            customer_id: customerId,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newMou.id,
                start_date: newMou.start_date,
                finish_date: newMou.finish_date,
                mou_file: newMou.mou_file,
                customer_id: newMou.customer_id,
                created_at: newMou.createdAt,
                updated_at: newMou.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateMou = async function (req, res) {
    try {
        const id = req.params.id;
        const { startDate, endDate } = req.body;
        const mouFile = req.file.path;

        const data = await mou.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `MoU dengan id ${id} tidak ditemukan`,
            });
        }

        data.start_date = startDate;
        data.finish_date = endDate;
        data.mou_file = mouFile;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Tipe mou berhasil diupdate",
            data: {
                id: data.id,
                start_date: data.start_date,
                finish_date: data.finish_date,
                mou_file: data.mou_file,
                customer_id: data.customer_id,
                created_at: data.createdAt,
                updated_at: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteMou = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await mou.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Mou dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus mou dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export { getMouById, allMou, addMou, updateMou, deleteMou, multerMou };
