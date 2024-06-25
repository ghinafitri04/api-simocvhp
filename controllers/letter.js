// const { where } = require("sequelize");
// const multer = require("multer");
import letter from "../models/letter.js";
import multer from "multer";
import letter_type from "../models/letter_type.js";
import user from "../models/user.js";

const letterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "assets/letter");
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
const multerLetter = multer({
    storage: letterStorage,
    fileFilter: fileFilter,
}).single("letterFile");

// const allLetter = async function (req, res) {
//     try {
//         const data = await letter.findAll({
//             include: [
//                 {
//                     model: letter_type,
//                     as: "letter_type",
//                     attributes: ["letter_type"],
//                 },
//                 {
//                     model: user,
//                     as: "user",
//                     attributes: ["username", "user_name", "position"],
//                 },
//             ],
//         });

//         if (data.length == 0) {
//             res.send("Belum ada surat yang diajukan");
//         }

//         const result = {
//             status: "ok",
//             count: data.length,
//             data: data,
//         };

//         res.json(result);
//     } catch (error) {
//         console.log(
//             "<<< Terjadi Kesalahan, tidak dapat menampilkan  surat >>>",
//             error
//         );
//     }
// };

// const getLetterById = async function (req, res) {
//     try {
//         const id = req.params.id;

//         const data = await letter.findOne({
//             include: [
//                 {
//                     model: letter_type,
//                     as: "letter_type",
//                     attributes: ["letter_type"],
//                 },
//                 {
//                     model: user,
//                     as: "user",
//                     attributes: ["username", "user_name", "position"],
//                 },
//             ],
//             where: { id: id },
//         });
//         if (data === null) {
//             return res.status(404).json({
//                 status: "failed",
//                 message: ` surat dengan id ${id} tidak ditemukan`,
//             });
//         }
//         res.json({
//             status: "ok",
//             data: data,
//         });
//     } catch (error) {
//         console.log("<<< Terjadi Kesalahan, tidak dapat menampilkan surat >>>");
//     }
// };

const allLetter = async function (req, res) {
    try {
        const data = await letter.findAll({
            include: [
                {
                    model: letter_type,
                    as: "letter_type",
                    attributes: ["letter_type"],
                },
                {
                    model: user,
                    as: "user",
                    attributes: ["username", "user_name", "position"],
                },
            ],
        });

        if (data.length == 0) {
            res.send("Belum ada surat yang diajukan");
        }

        const result = {
            status: "ok",
            count: data.length,
            data: data.map((item) => ({
                ...item.toJSON(),
                file_url: item.file_url,
            })),
        };

        res.json(result);
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan  surat >>>",
            error
        );
    }
};

const getLetterById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter.findOne({
            include: [
                {
                    model: letter_type,
                    as: "letter_type",
                    attributes: ["letter_type"],
                },
                {
                    model: user,
                    as: "user",
                    attributes: ["username", "user_name", "position"],
                },
            ],
            where: { id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: ` surat dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: {
                ...data.toJSON(),
                file_url: data.file_url,
            },
        });
    } catch (error) {
        console.log("<<< Terjadi Kesalahan, tidak dapat menampilkan surat >>>");
    }
};
const getLetterByUserId = async function (req, res) {
    try {
        const id = req.user.id;

        const data = await letter.findAll({
            include: [
                {
                    model: letter_type,
                    as: "letter_type",
                    attributes: ["letter_type"],
                },
            ],
            where: { user_id: id },
        });
        if (data.length == 0) {
            res.send("Belum ada surat yang diajukan");
        }
        res.json({
            status: "ok",
            data: data.map((item) => ({
                ...item.toJSON(),
                file_url: item.file_url,
            })),
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan surat >>>",
            error
        );
    }
};

const addLetter = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(422).json({
                status: "failed",
                message: `File Surat harus di upload`,
            });
        }
        const userID = req.user.id;
        const { tittle, letterTypeId, tanggalPengajuan } = req.body;
        const letterFile = req.file.path;

        const newLetter = await letter.create({
            tittle: tittle,
            letter_files: letterFile,
            tanggal_pengajuan: tanggalPengajuan,
            status: "belum diverifikasi",
            letter_type_id: letterTypeId,
            user_id: userID,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newLetter.id,
                tittle: newLetter.tittle,
                letter_files: newLetter.letter_files,
                tanggal_pengajuan: newLetter.tanggal_pengajuan,
                status: newLetter.status,
                user_id: newLetter.user_id,
                createdAt: newLetter.createdAt,
                updatedAt: newLetter.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const editLetter = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Surat dengan id ${id} tidak ditemukan`,
            });
        }
        const userID = req.user.id;
        const { tittle, letterTypeId, tanggalPengajuan } = req.body;
        const letterFile = req.file.path;

        data.tittle = tittle;
        data.letter_files = letterFile;
        data.tanggal_pengajuan = tanggalPengajuan;
        data.letter_type_id = letterTypeId;
        data.user_id = userID;
        data.status = "belum diverifikasi";
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Surat berhasil diubah",
            data: {
                id: data.id,
                tittle: data.tittle,
                letter_files: data.letter_files,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                user_id: data.user_id,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const verifyLetter = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Surat dengan id ${id} tidak ditemukan`,
            });
        }

        data.status = "diverifikasi";
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Surat berhasil diverifikasi",
            data: {
                id: data.id,
                tittle: data.tittle,
                letter_files: data.letter_files,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                user_id: data.user_id,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const rejectLetter = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Surat dengan id ${id} tidak ditemukan`,
            });
        }

        data.status = "ditolak";
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Surat telah ditolak",
            data: {
                id: data.id,
                tittle: data.tittle,
                letter_files: data.letter_files,
                tanggal_pengajuan: data.tanggal_pengajuan,
                status: data.status,
                user_id: data.user_id,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteLetter = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await letter.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Jenis surat dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus  surat dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getLetterById,
    allLetter,
    addLetter,
    verifyLetter,
    rejectLetter,
    deleteLetter,
    multerLetter,
    editLetter,
    getLetterByUserId,
};
