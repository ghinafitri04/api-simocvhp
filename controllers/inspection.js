// const { where } = require("sequelize");
// const inspection = require("../models/inspection");

import inspection from "../models/inspection.js";
import customer from "../models/customer.js";
import user from "../models/user.js";
import customer_detail from "../models/customer_detail.js";
import product from "../models/product.js";

const allInspection = async function (req, res) {
    try {
        const data = await inspection.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: ["id", "username", "user_name", "position"],
                },
                {
                    model: customer,
                    as: "customer",
                    attributes: [
                        "customer_name",
                        "company_name",
                        "address",
                        "phone_number",
                    ],
                },
            ],
        });

        if (data.length == 0) {
            res.send("Belum ada inspeksi tersedia");
        }

        const result = {
            status: "ok",
            count: data.length,
            data: data,
        };

        res.json(result);
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan inspeksi >>>",
            error
        );
    }
};

const getInspectionById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await inspection.findOne({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: ["id", "username", "user_name", "position"],
                },
                {
                    model: customer,
                    as: "customer",
                    attributes: [
                        "customer_name",
                        "company_name",
                        "address",
                        "phone_number",
                    ],
                },
            ],
            where: { id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `inspeksi dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan inspeksi >>>"
        );
    }
};

const getInspectionByUserId = async function (req, res) {
    try {
        const id = req.user.id;

        const data = await inspection.findAll({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: [
                        "customer_name",
                        "company_name",
                        "address",
                        "phone_number",
                    ],
                },
            ],
            where: { user_id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `inspeksi dengan karyawan dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan inspeksi >>>"
        );
    }
};

const getInspectionByCustomerId = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await inspection.findAll({
            include: [
                {
                    model: customer,
                    as: "customer",
                    attributes: [
                        "customer_name",
                        "company_name",
                        "address",
                        "phone_number",
                    ],
                },
                {
                    model: user,
                    as: "user",
                    attributes: ["user_name"],
                },
            ],
            where: { customer_id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `inspeksi dengan karyawan dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan inspeksi >>>"
        );
    }
};

const addInspection = async function (req, res) {
    try {
        const { customerId, userId, inspectionDate } = req.body;

        // Ambil daftar barang dari detail_customer berdasarkan customerId
        const customerDetails = await customer_detail.findAll({
            where: { customer_id: customerId },
        });

        // Periksa stok barang di tabel product
        for (const detail of customerDetails) {
            const curretProduct = await product.findOne({
                where: { id: detail.product_id },
            });

            if (curretProduct.product_stock < detail.qty) {
                return res.status(400).json({
                    status: "error",
                    message: `Barang ${curretProduct.product_name} tidak mencukupi untuk dilakukan inspeksi`,
                });
            }
        }

        // Jika semua barang mencukupi, buat inspeksi baru
        const newInspection = await inspection.create({
            user_id: userId,
            customer_id: customerId,
            inspection_date: inspectionDate,
            status: "Belum diinspeksi",
            description: "",
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newInspection.id,
                customer_id: newInspection.customer_id,
                user_id: newInspection.user_id,
                inspection_date: newInspection.inspection_date,
                status: newInspection.status,
                description: newInspection.description,
                createdAt: newInspection.createdAt,
                updatedAt: newInspection.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server",
        });
    }
};

const editInspection = async function (req, res) {
    try {
        const inspectionId = req.params.id;
        const { userId, customerId, inspectionDate } = req.body;

        // Find the existing inspection
        const existingInspection = await inspection.findOne({
            where: { id: inspectionId },
        });

        if (!existingInspection) {
            return res.status(404).json({
                status: "error",
                message: `Inspeksi dengan id ${inspectionId} tidak ditemukan`,
            });
        }

        // Ambil daftar barang dari detail_customer berdasarkan customerId
        const customerDetails = await customer_detail.findAll({
            where: { customer_id: customerId },
        });

        // Periksa stok barang di tabel product
        for (const detail of customerDetails) {
            const currentProduct = await product.findOne({
                where: { id: detail.product_id },
            });

            if (currentProduct.product_stock < detail.qty) {
                return res.status(400).json({
                    status: "error",
                    message: `Barang ${currentProduct.product_name} tidak mencukupi untuk dilakukan inspeksi`,
                });
            }
        }

        // Update the inspection record
        existingInspection.user_id = userId;
        existingInspection.customer_id = customerId;
        existingInspection.inspection_date = inspectionDate;
        existingInspection.status = "Belum diinspeksi";
        existingInspection.description = ""; // Update other fields as needed

        await existingInspection.save();

        res.status(200).json({
            status: "ok",
            data: {
                id: existingInspection.id,
                customer_id: existingInspection.customer_id,
                user_id: existingInspection.user_id,
                inspection_date: existingInspection.inspection_date,
                status: existingInspection.status,
                description: existingInspection.description,
                createdAt: existingInspection.createdAt,
                updatedAt: existingInspection.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server",
        });
    }
};

const inspect = async function (req, res) {
    try {
        const id = req.params.id;
        const description = req.body.description;
        const items = req.body.items; // Ambil data barang dan kuantitas dari request body

        // Validasi input
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "Daftar barang tidak valid",
            });
        }

        const data = await inspection.findByPk(id);
        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: "Data inspeksi tidak ditemukan",
            });
        }

        const company = await customer.findByPk(data.customer_id);
        if (!company) {
            return res.status(404).json({
                status: "failed",
                message: "Data perusahaan tidak ditemukan",
            });
        }

        if (data.status === "Sudah diinspeksi") {
            return res.status(400).json({
                status: "failed",
                message: `Inspeksi di perusahaan ${company.company_name} sudah dilaksanakan sebelumnya, periksa kembali`,
            });
        } else {
            // Kurangi stok produk berdasarkan input user
            for (const item of items) {
                const { product_id, qty } = item;

                const setProduct = await product.findByPk(product_id);
                if (!setProduct) {
                    return res.status(404).json({
                        status: "failed",
                        message: `Produk dengan ID ${product_id} tidak ditemukan`,
                    });
                }

                if (setProduct.product_stock >= qty) {
                    setProduct.product_stock -= qty;
                    await setProduct.save();
                } else {
                    return res.status(400).json({
                        status: "failed",
                        message: `Stok barang ${setProduct.product_name} tidak mencukupi, periksa kembali stok barang anda`,
                    });
                }
            }

            data.status = "Sudah diinspeksi";
            data.description = description;
            data.updatedAt = new Date();
            await data.save();

            res.status(200).json({
                status: "ok",
                message: "Inspeksi telah dilaksanakan",
                data: {
                    id: data.id,
                    customer_id: data.customer_id,
                    inspection_date: data.inspection_date,
                    status: data.status,
                    description: data.description,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                },
            });
        }
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server",
        });
    }
};

const deleteInspection = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await inspection.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Inspeksi dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus inspeksi dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getInspectionById,
    allInspection,
    addInspection,
    getInspectionByUserId,
    inspect,
    deleteInspection,
    getInspectionByCustomerId,
    editInspection,
};
