
const mongoose = require("mongoose")
const schema = mongoose.Schema
const Joi = require("joi")

const productValidation = Joi.object({
    productName: Joi.string().required().min(3),
    productPrice: Joi.string().required().min(2),
    productDesc: Joi.string().required().min(10),
    productColor: Joi.array().items(Joi.string()),
    productSize: Joi.array().items(Joi.string()),
    brandName: Joi.string().required().min(3),
    image: Joi.string().required(),
    productImages: Joi.array().items(Joi.string())
})

const ProductSchema = new schema({
    productName: {
        type: String,
        require: true

    },

    productPrice: {
        type: String,
        require: true


    },
    productDesc: {
        type: String,
        require: true

    },
    productColor: {
        type: [String],
        require: true
    },
    productSize: {
        type: [String],
        require: true
    },
    status: {
        type: Boolean,
        require: true
    },
    brandName: {
        type: String,
        require: true

    },
    image: {
        type: String,
        require: true
    },

    productImages: {
        type: [String],
        require: true
    },

    deleted: {
        type: Boolean,
        default: false
    },


    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

const ProductModel = mongoose.model("product", ProductSchema)
module.exports = { ProductModel, productValidation }