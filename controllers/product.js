import product_type from "../models/product_type.js";
import product from "../models/product.js";
// const { where } = require("sequelize");
// const product = require("../models/product");

const allProduct = async function (req, res) {
    try {
        // Get page and limit from query parameters, set default values if not provided
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: data } = await product.findAndCountAll({
            include: [
                {
                    model: product_type,
                    as: "product_type",
                    attributes: ["product_type"],
                },
            ],
            limit: limit,
            offset: offset,
        });

        if (data.length == 0) {
            return res.send("Belum ada barang tersedia");
        }

        const result = {
            status: "ok",
            count: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: data,
        };

        res.json(result);
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan barang >>>",
            error
        );
        res.status(500).send("Internal Server Error");
    }
};

const getProductById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await product.findOne({
            include: [
                {
                    model: product_type,
                    as: "product_type",
                },
            ],
            where: { id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `barang dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan barang >>>"
        );
    }
};

const addProduct = async function (req, res) {
    try {
        const { productName, stock, productTypeId } = req.body;

        const cekProduct = await product.findOne({
            where: { product_name: productName },
        });

        if (cekProduct === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Barang ${productName} sudah ada`,
            });
        }

        const newProduct = await product.create({
            product_name: productName,
            product_type_id: productTypeId,
            product_stock: stock,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newProduct.id,
                product_name: newProduct.product_name,
                product_stock: newProduct.product_stock,
                product_type_id: newProduct.product_type_id,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateProduct = async function (req, res) {
    try {
        const id = req.params.id;
        const { productName, stock, productTypeId } = req.body;

        const data = await product.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Tipe Produk dengan id ${id} tidak ditemukan`,
            });
        }

        const dataProduct = await product.findOne({
            where: { product_name: productName },
        });
        if (dataProduct === null) {
            console.log("Not found!");
        } else if (dataProduct.product_name != data.product_name) {
            return res.status(404).json({
                status: "failed",
                message: `Tipe barang ${productName} sudah ada`,
            });
        }
        data.product_name = productName;
        data.product_stock = stock;
        data.product_type_id = productTypeId;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Tipe barang berhasil diupdate",
            data: {
                id: data.id,
                product_name: data.product_name,
                product_stock: data.product_stock,
                product_type_id: data.product_type_id,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteProduct = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await product.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Barang dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus barang dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export { getProductById, allProduct, addProduct, updateProduct, deleteProduct };
