import customer from "../models/customer.js";

const allCustomer = async function (req, res) {
    try {
        // Mendapatkan parameter page dan limit dari query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Mendapatkan data customer dengan limit dan offset
        const { count, rows } = await customer.findAndCountAll({
            limit: limit,
            offset: offset,
        });

        // Mengecek apakah ada data
        if (rows.length === 0) {
            return res.send("Belum ada customer tersedia");
        }

        const result = {
            status: "ok",
            page: page,
            limit: limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            data: rows,
        };

        res.json(result);
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan customer >>>",
            error
        );
        res.status(500).send("Terjadi kesalahan server");
    }
};

const getCustomerById = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await customer.findByPk(id);
        if (data === null) {
            return res.status(404).json({
                status: "failed",
                message: `customer dengan id ${id} tidak ditemukan`,
            });
        }
        res.json({
            status: "ok",
            data: data,
        });
    } catch (error) {
        console.log(
            "<<< Terjadi Kesalahan, tidak dapat menampilkan customer >>>"
        );
    }
};

const addCustomer = async function (req, res) {
    try {
        const { customerName, companyName, address, phoneNumber } = req.body;

        const cekCustomer = await customer.findOne({
            where: { customer_name: customerName },
        });

        if (cekCustomer === null) {
            console.log("Not found!");
        } else {
            return res.status(404).json({
                status: "failed",
                message: `Customer ${customerName} sudah ada`,
            });
        }

        const newCustomer = await customer.create({
            customer_name: customerName,
            company_name: companyName,
            address: address,
            phone_number: phoneNumber,
        });

        res.status(201).json({
            status: "ok",
            data: {
                id: newCustomer.id,
                customerName: newCustomer.customer_name,
                companyName: newCustomer.company_name,
                address: newCustomer.address,
                createdAt: newCustomer.createdAt,
                updatedAt: newCustomer.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const updateCustomer = async function (req, res) {
    try {
        const id = req.params.id;
        const { customerName, companyName, address, phoneNumber } = req.body;

        const data = await customer.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Customer dengan id ${id} tidak ditemukan`,
            });
        }
        data.customer_name = customerName;
        data.company_name = companyName;
        data.address = address;
        data.phone_number = phoneNumber;
        data.updatedAt = new Date();
        data.save();

        res.status(200).json({
            status: "ok",
            message: "Customer berhasil diupdate",
            data: {
                id: data.id,
                customerName: data.customer_name,
                companyName: data.company_name,
                address: data.address,
                phoneNumber: data.phone_number,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

const deleteCustomer = async function (req, res) {
    try {
        const id = req.params.id;

        const data = await customer.findByPk(id);

        if (!data) {
            return res.status(404).json({
                status: "failed",
                message: `Customer dengan id ${id} tidak ditemukan`,
            });
        }

        data.destroy();
        res.json({
            status: "ok",
            message: `Berhasil menghapus customer dengan id ${id}`,
        });
    } catch (error) {
        console.log(error, "<<< terjadi kesalahan");
    }
};

export {
    getCustomerById,
    allCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
};
