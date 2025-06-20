const express=require("express")
const ProductApiController=require("../controller/productApiController")
const router=express.Router()
const ProductImageupload=require("../helper/productImageUpload")


router.post("/create/product",ProductImageupload.single('image'),ProductApiController.createProduct)
router.get("/products",ProductApiController.Productlist)
router.get("/product/single/:id",ProductApiController.singleProduct)
router.post("/product/update/:id",ProductImageupload.single('image'),ProductApiController.updateProduct)
router.delete("/product/delete/:id",ProductApiController.softDelete)
router.get("/product/search",ProductApiController.searchProducts.bind(ProductApiController))
module.exports=router