const product_type = require("../models/product_type");
import product_type from "../models/product_type.js";

const allProductType = async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const totalCount = await product_type.count();

        const data = await product_type.findAll({
            offset: offset,
            limit: limit,
        });

        if (data.length === 0) {
            return res.send("Belum ada tipe barang tersedia");
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
            "<<< Terjadi Kesalahan, tidak dapat menampilkan tipe barang >>>",
            error
        );
        res.status(500).send("Internal Server Error");
    }
};

const getProductTypeById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await product_type.findByPk(id);
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `tipe barang dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan tipe barang >>>"
        );
    }
};

const addProductType = async function (req, res) {
    try {
        const productType = req.body.productType;

        const cekProductType = await product_type.findOne({
            where: { product_type: productType },
        });

        if (cekProductType === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Tipe barang ${productType} sudah ada`,
            });
        }

        const newProductType = await product_type.create({
            product_type: productType,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newProductType.id,
                kategori: newProductType.product_type,
                createdAt: newProductType.createdAt,
                updatedAt: newProductType.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateProductType = async function (req, res) {
    try {
        const id = req.params.id;
        const newProductType = req.body.productType;

        const data = await product_type.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Tipe Produk dengan id ${id} tidak ditemukan`,
            });
        }

        const productType = await product_type.findOne({
            where: { product_type: newProductType },
        });
        if (productType === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Tipe barang ${newProductType} sudah ada`,
            });
        }
        data.product_type = newProductType;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Tipe barang berhasil diupdate",
            data: {
                id: data.id,
                kategori: data.product_type,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteProductType = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await product_type.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Tipe barang dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus tipe barang dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getProductTypeById,
    allProductType,
    addProductType,
    updateProductType,
    deleteProductType,
};
