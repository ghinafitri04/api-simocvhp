const letter_type = require("../models/letter_type");
import letter_type from "../models/letter_type.js";

const allLetterType = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const totalCount = await letter_type.count();

        const data = await letter_type.findAll({
            offset: offset,
            limit: limit,
        });

        if (data.length === 0) {
            return res.send("Belum ada jenis surat tersedia");
        }

        const result = {
            status: "ok",
            count: data.length,
            totalRecords: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / pageSize),
            data: data,
        };

        res.json(result);
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan jenis surat >>>",
            error
        );
        res.status(500).send("Internal Server Error");
    }
};

const getLetterTypeById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter_type.findByPk(id);
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `jenis surat dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan jenis surat >>>"
        );
    }
};

const addLetterType = async function (req, res) {
    try {
        const letterType = req.body.letterType;

        const cekLetterType = await letter_type.findOne({
            where: { letter_type: letterType },
        });

        if (cekLetterType === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Jenis surat ${letterType} sudah ada`,
            });
        }

        const newLetterType = await letter_type.create({
            letter_type: letterType,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newLetterType.id,
                kategori: newLetterType.letter_type,
                createdAt: newLetterType.createdAt,
                updatedAt: newLetterType.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateLetterType = async function (req, res) {
    try {
        const id = req.params.id;
        const newLetterType = req.body.letterType;

        const data = await letter_type.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Jenis surat dengan id ${id} tidak ditemukan`,
            });
        }

        const letterType = await letter_type.findOne({
            where: { letter_type: newLetterType },
        });
        if (letterType === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Jenis surat ${newLetterType} sudah ada`,
            });
        }
        data.letter_type = newLetterType;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Jenis surat berhasil diupdate",
            data: {
                id: data.id,
                kategori: data.letter_type,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteLetterType = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter_type.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Jenis surat dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus jenis surat dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getLetterTypeById,
    allLetterType,
    addLetterType,
    updateLetterType,
    deleteLetterType,
};
