import customer from "../models/customer.js";
import customer_detail from "../models/customer_detail.js";
import product from "../models/product.js";
import product_type from "../models/product_type.js";

const getCustomerDetailsByCustomerId = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await customer_detail.findAll({
            include: [
                {
                    model: product,
                    as: "product",
                    attributes: ["product_name"],
                    include: [
                        {
                            model: product_type,
                            as: "product_type",
                            attributes: ["product_type"],
                        },
                    ],
                },
                {
                    model: customer,
                    as: "customer",
                    attributes: ["company_name"],
                },
            ],
            where: { customer_id: id },
        });
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `customerDetails dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan customerDetails >>>",
            error
        );
    }
};

const addCustomerDetails = async function (req, res) {
    try {
        const customerId = req.params.id;
        const { productId, qty } = req.body;

        const cekProdu = await customer_detail.findOne({
            where: { product_id: productId, customer_id: customerId },
            attributes: [
                "product_id",
                "customer_id",
                "qty",
                "createdAt",
                "updatedAt",
            ],
        });

        if (cekProdu === null) {
            console.log("Not found!");
            const newCustomerDetails = await customer_detail.create({
                customer_id: customerId,
                product_id: productId,
                qty: qty,
            });

            res.status(201).json({
                status: "ok",
                data: {
                    customer_id: newCustomerDetails.customer_id,
                    product_id: newCustomerDetails.productId,
                    qty: newCustomerDetails.qty,
                    createdAt: newCustomerDetails.createdAt,
                    updatedAt: newCustomerDetails.updatedAt,
                },
            });
        } else {
            // return res.status(404).json({
            //     status: "failed",
            //     message: `produk tersebut sudah ditambahkan sebelumnya`,
            // });
            cekProdu.qty = cekProdu.qty + parseInt(qty, 10);
            cekProdu.updatedAt = new Date();
            cekProdu.save();
            res.status(201).json({
                status: "ok",
                data: {
                    customer_id: cekProdu.customer_id,
                    product_id: cekProdu.productId,
                    qty: cekProdu.qty,
                    createdAt: cekProdu.createdAt,
                    updatedAt: cekProdu.updatedAt,
                },
            });
        }
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateCustomerDetails = async function (req, res) {
    try {
        const customerId = req.params.id;
        const productId = req.params.productId;
        const { qty } = req.body;

        const data = await customer_detail.findOne({
            where: { product_id: productId, customer_id: customerId },
        });

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `CustomerDetails tidak ditemukan`,
            });
        }
        data.qty = qty;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "CustomerDetails berhasil diupdate",
            data: {
                customer_id: data.customer_id,
                product_id: data.product_id,
                qty: data.qty,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteCustomerDetails = async function (req, res) {
    try {
        const customerId = req.params.id;
        const productId = req.params.productId;

        const data = await customer_detail.findOne({
            where: { product_id: productId, customer_id: customerId },
        });

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Customer Details tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus customerDetails`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getCustomerDetailsByCustomerId,
    addCustomerDetails,
    updateCustomerDetails,
    deleteCustomerDetails,
};
