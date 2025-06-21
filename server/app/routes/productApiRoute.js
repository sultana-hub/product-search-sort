const express=require("express")
const ProductApiController=require("../controller/productApiController")
const router=express.Router()
const productImageFields=require("../helper/productImageUpload")


router.post("/create/product",productImageFields,ProductApiController.createProduct)
router.get("/products",ProductApiController.Productlist)
router.get("/product/single/:id",ProductApiController.singleProduct)
router.post("/product/update/:id",productImageFields,ProductApiController.updateProduct)
router.delete("/product/delete/:id",ProductApiController.softDelete)
router.get("/product/search",ProductApiController.searchProducts.bind(ProductApiController))
module.exports=router