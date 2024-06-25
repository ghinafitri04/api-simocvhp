import { Sequelize, Op } from "sequelize";
import user from "../models/user.js";
import bcrypt from "bcrypt";

const getAllUser = async function (req, res) {
    try {
        const allUser = await user.findAll({
            attributes: [
                "id",
                "username",
                "user_name",
                "position",
                "role",
                "birth_date",
                "join_date",
                "phone_number",
                "address",
            ],
        });

        if (allUser.length == 0) {
            return res.status(400).json({ message: "Belum ada allUser" });
        }

        const result = {
            status: "ok",
            data: allUser,
        };

        res.json(result);
    } catch (err) {
        console.log(
            err,
            "<<< Terjadi Kesalahan, tidak dapat menampilkan User >>>"
        );
    }
};

const getAllKaryawan = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Mengambil nomor halaman dari query parameter, defaultnya adalah halaman 1
        const perPage = parseInt(req.query.perPage) || 10; // Mengambil jumlah data per halaman dari query parameter, defaultnya adalah 10

        const { count, rows } = await user.findAndCountAll({
            attributes: [
                "id",
                "username",
                "user_name",
                "position",
                "role",
                "birth_date",
                "join_date",
                "phone_number",
                "address",
            ],
            where: {
                role: {
                    [Op.ne]: "admin",
                },
            },
            limit: perPage,
            offset: (page - 1) * perPage,
            order: [["user_name", "ASC"]],
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tidak ada data karyawan" });
        }

        const result = {
            status: "ok",
            data: rows,
            pagination: {
                totalData: count, // Total data keseluruhan
                currentPage: page, // Nomor halaman saat ini
                perPage: perPage, // Jumlah data per halaman
                totalPages: Math.ceil(count / perPage), // Jumlah total halaman
            },
        };

        res.json(result);
    } catch (err) {
        console.error(
            "Terjadi kesalahan saat mengambil data karyawan:",
            err.message
        );
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data karyawan",
        });
    }
};
const getAllEmploye = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Mengambil nomor halaman dari query parameter, defaultnya adalah halaman 1
        const perPage = parseInt(req.query.perPage) || 10; // Mengambil jumlah data per halaman dari query parameter, defaultnya adalah 10

        const { count, rows } = await user.findAndCountAll({
            attributes: [
                "id",
                "username",
                "user_name",
                "position",
                "role",
                "birth_date",
                "join_date",
                "phone_number",
                "address",
            ],
            where: {
                role: "karyawan",
            },
            limit: perPage,
            offset: (page - 1) * perPage,
            order: [["user_name", "ASC"]],
        });

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tidak ada data karyawan" });
        }

        const result = {
            status: "ok",
            data: rows,
            pagination: {
                totalData: count, // Total data keseluruhan
                currentPage: page, // Nomor halaman saat ini
                perPage: perPage, // Jumlah data per halaman
                totalPages: Math.ceil(count / perPage), // Jumlah total halaman
            },
        };

        res.json(result);
    } catch (err) {
        console.error(
            "Terjadi kesalahan saat mengambil data karyawan:",
            err.message
        );
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil data karyawan",
        });
    }
};

const getUserById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await user.findOne({
            attributes: [
                "id",
                "username",
                "user_name",
                "position",
                "role",
                "birth_date",
                "join_date",
                "phone_number",
                "address",
            ],
            where: { id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: ` user dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log("<<< Terjadi Kesalahan, tidak dapat menampilkan user >>>");
    }
};

const addUser = async function (req, res) {
    try {
        // const username = req.body;
        // console.log(username);
        const {
            username,
            password,
            userName,
            position,
            role,
            birthDate,
            joinDate,
            phoneNumber,
            address,
        } = req.body;
        const usernameExist = await user.findOne({
            where: { username: req.body.username },
        });
        if (usernameExist)
            return res.status(400).send("username sudah dipakai");
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await user.create({
            username: username,
            password: hashPassword,
            user_name: userName,
            position: position,
            role: role,
            birth_date: birthDate,
            join_date: joinDate,
            phone_number: phoneNumber,
            address: address,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newUser.id,
                username: newUser.username,
                user_name: newUser.user_name,
                position: newUser.position,
                role: newUser.role,
                birth_date: newUser.birth_date,
                join_date: newUser.join_date,
                phone_number: newUser.phone_number,
                address: newUser.address,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const editUser = async function (req, res) {
    try {
        const userId = req.params.id;
        const {
            username,
            userName,
            position,
            role,
            phoneNumber,
            address,
            joinDate,
        } = req.body;

        // Cari user berdasarkan ID
        const userToUpdate = await user.findByPk(userId);

        if (!userToUpdate) {
            return res.status(404).json({
                status: "failed",
                message: "User tidak ditemukan",
            });
        }

        // Cek apakah username baru berbeda dari username saat ini dan sudah dipakai oleh user lain
        if (username && username !== userToUpdate.username) {
            const usernameExist = await user.findOne({
                where: {
                    username: username,
                    id: { [Sequelize.Op.ne]: userId }, // Pastikan tidak mengecek user yang sedang diedit
                },
            });
            if (usernameExist) {
                return res.status(400).json({
                    status: "failed",
                    message: "Username sudah dipakai oleh user lain",
                });
            }
        }

        // Update user dengan data baru
        userToUpdate.username = username || userToUpdate.username;
        userToUpdate.user_name = userName || userToUpdate.user_name;
        userToUpdate.position = position || userToUpdate.position;
        userToUpdate.role = role || userToUpdate.role;
        userToUpdate.phone_number = phoneNumber || userToUpdate.phone_number;
        userToUpdate.address = address || userToUpdate.address;
        userToUpdate.join_date = joinDate || userToUpdate.join_date;
        userToUpdate.updatedAt = new Date();

        // Simpan perubahan
        await userToUpdate.save();

        res.status(200).json({
            status: "ok",
            data: {
                id: userToUpdate.id,
                username: userToUpdate.username,
                user_name: userToUpdate.user_name,
                position: userToUpdate.position,
                role: userToUpdate.role,
                phone_number: userToUpdate.phone_number,
                address: userToUpdate.address,
                createdAt: userToUpdate.createdAt,
                updatedAt: userToUpdate.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan saat mengedit user",
        });
    }
};

const deleteUser = async function (req, res) {
    try {
        const userId = req.params.id;

        // Cari user berdasarkan ID
        const userToDelete = await user.findByPk(userId);

        if (!userToDelete) {
            return res.status(404).json({
                status: "failed",
                message: "User tidak ditemukan",
            });
        }

        // Hapus user
        await userToDelete.destroy();

        res.status(200).json({
            status: "ok",
            message: `User dengan id ${userId} berhasil dihapus`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan saat menghapus user",
        });
    }
};

export {
    getAllUser,
    addUser,
    getAllKaryawan,
    editUser,
    deleteUser,
    getUserById,
    getAllEmploye,
};
