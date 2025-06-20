
const httpStatusCode = require("../helper/httpStatusCode")
const {ProductModel,productValidation} = require("../model/productApiModel")
const fs = require("fs")


class ProducApiController {
    //create product
    // async createProduct(req, res) {
    //     try {
    //         //console.log(req.body)
    //         console.log(req.file)
    //         const { productName, productPrice, productDesc, productColor, productSize, productStatus, brandName } = req.body
    //         if (!productName || !productPrice || !productDesc || !productColor || !productSize || !brandName) {
    //             return res.status(errorCode.BadRequest).json({
    //                 status: false,
    //                 message: "All fields are required"
    //             })
    //         }

    //         else if (productName.length < 3 || productName.length > 40) {
    //             return res.status(errorCode.BadRequest).json({
    //                 status: false,
    //                 message: "product Name must be between 3 and 40 characters"
    //             });
    //         }
    //         else if (productDesc.length < 10 || productDesc.length > 500) {
    //             return res.status(errorCode.BadRequest).json({
    //                 status: false,
    //                 message: "Description must be between 10 and 500 characters"
    //             })
    //         }
    //         else if (productPrice.length < 3 || productPrice.length > 40) {
    //             return res.status(errorCode.BadRequest).json({
    //                 status: false,
    //                 message: "product Price must be between 3 and 40 characters"
    //             });
    //         }

    //         else if (brandName.length < 3 || brandName.length > 40) {
    //             return res.status(errorCode.BadRequest).json({
    //                 status: false,
    //                 message: "product Brand must be between 3 and 40 characters"
    //             });
    //         }



    //         const pdata = new ProductModel({
    //             productName,
    //             productPrice,
    //             productDesc,
    //             productColor,
    //             productSize,
    //             productStatus,
    //             brandName
    //         })
    //         if (req.file) {
    //             pdata.image = req.file.path
    //         }
    //         const data = await pdata.save()
    //         return res.status(errorCode.Create).json({
    //             status: true,
    //             message: "Produc creadted successfully",
    //             data: data
    //         })


    //     } catch (error) {
    //         return res.status(errorCode.InternalServerError).json({
    //             status: false,
    //             message: error.massage
    //         })
    //     }

    // }

 async createProduct(req, res) {

        try {

            console.log(req.body)
            const prodData = {
                productName: req.body.productName,
                productPrice: req.body.productPrice,
                productDesc: req.body.productDesc,
                productColor: Array.isArray(req.body.productColor)
                    ? req.body.productColor
                    : req.body.productColor.split(',').map(c=>c.trim()),
                productSize: Array.isArray(req.body.productSize)
                    ? req.body.productSize : req.body.productSize.split(',').map(s=>s.trim()),
                brandName: req.body.brandName
            }
            console.log(req.file)
            if (req.file) {
                prodData.image = req.file.path
            }

            const { error, value } = productValidation.validate(prodData)

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message
                })
            } else {
                const data = await ProductModel.create(value)
                // res.redirect('/api/dashboard');
                return res.status(httpStatusCode.Ok).json({
                    status: true,
                    message: "Product created successfully",
                    data: data
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }




    }


    //get all products
  async Productlist(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalProduct = await ProductModel.countDocuments({ deleted: false });

    const product = await ProductModel.find({ deleted: false })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + product.length < totalProduct;

    return res.status(httpStatusCode.Ok).json({
      status: true,
      message: "Get all products successfully",
      total: totalProduct, 
      data: product,       
      hasMore,
      nextPage: page + 1
    });
  } catch (error) {
    return res.status(httpStatusCode.InternalServerError).json({
      status: false,
      message: error.message
    });
  }
}

    //for get single data
    async singleProduct(req, res) {
        try {
            const id = req.params.id

            const single = await ProductModel.findById(id)

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "get single data",
                data: single
            })

        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }
    }

    //update single data
   
    

   async updateProduct(req, res) {

        // try {
        //     const id = req.params.id;

        //     // Finding existing product
        //     const product = await ProductModel.findById(id);
        //     if (!product) {
        //         return res.status(httpStatusCode.NotFound).json({
        //             status: false,
        //             message: "Product not found"
        //         });
        //     }

        //     // Converting comma-separated strings to arrays if provided
        //     const colorArray = req.body.productColor
        //         ? req.body.productColor.split(',').map(c => c.trim())
        //         : product.productColor;

        //     const sizeArray = req.body.productSize
        //         ? req.body.productSize.split(',').map(s => s.trim())
        //         : product.productSize;

        //     // Updating fields manually
        //     product.productName = req.body.productName || product.productName;
        //     product.productPrice = req.body.productPrice || product.productPrice;
        //     product.productDesc = req.body.productDesc || product.productDesc;
        //     product.productColor = colorArray;
        //     product.productSize = sizeArray;
        //     product.brandName = req.body.brandName || product.brandName;

        //     // Handle image update
        //     if (req.file) {
        //         if (product.image && fs.existsSync(product.image)) {
        //             fs.unlinkSync(product.image);
        //         }
        //         product.image = req.file.path;
        //     }

        //     // Joi Validation
        //     const { error, value } = productValidation.validate({
        //         productName: product.productName,
        //         productPrice: product.productPrice,
        //         productDesc: product.productDesc,
        //         productColor: product.productColor,
        //         productSize: product.productSize,
        //         brandName: product.brandName,
        //         image: product.image
        //     });

        //     if (error) {
        //         return res.status(httpStatusCode.BadRequest).json({
        //             status: false,
        //             message: error.details[0].message
        //         });
        //     }

        //     // Save updated product
        //     const updatedProduct = await product.save();

        //     // res.redirect('/api/dashboard')

        //     return res.status(httpStatusCode.Ok).json({
        //         status: true,
        //         message: "Product updated successfully",
        //         data: updatedProduct
        //     });

        // } catch (error) {
        //     console.error("Update product error:", error);
        //     return res.status(httpStatusCode.InternalServerError).json({
        //         status: false,
        //         message: error.message
        //     });
        // }


try {
    const id = req.params.id;

    // Find existing product
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(httpStatusCode.NotFound).json({
        status: false,
        message: 'Product not found'
      });
    }

    // Use array format from multipart/form-data (like: productColor[] = "red", "blue")
    const productColor = req.body['productColor[]'] || req.body.productColor || product.productColor;
    const productSize = req.body['productSize[]'] || req.body.productSize || product.productSize;

    // Ensure values are arrays
    const colorArray = Array.isArray(productColor) ? productColor : [productColor];
    const sizeArray = Array.isArray(productSize) ? productSize : [productSize];

    // Update product fields
    product.productName = req.body.productName || product.productName;
    product.productPrice = req.body.productPrice || product.productPrice;
    product.productDesc = req.body.productDesc || product.productDesc;
    product.productColor = colorArray;
    product.productSize = sizeArray;
    product.brandName = req.body.brandName || product.brandName;

    // Handle image update
    if (req.file) {
      if (product.image && fs.existsSync(product.image)) {
        fs.unlinkSync(product.image);
      }
      product.image = req.file.path;
    }

    // Joi Validation
    const { error } = productValidation.validate({
      productName: product.productName,
      productPrice: product.productPrice,
      productDesc: product.productDesc,
      productColor: product.productColor,
      productSize: product.productSize,
      brandName: product.brandName,
      image: product.image
    });

    if (error) {
      return res.status(httpStatusCode.BadRequest).json({
        status: false,
        message: error.details[0].message
      });
    }

    const updatedProduct = await product.save();

    return res.status(httpStatusCode.Ok).json({
      status: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    return res.status(httpStatusCode.InternalServerError).json({
      status: false,
      message: error.message
    });
  }


    }


    // delete product
    async deleteProduct(req, res) {
        try {
            const id = req.params.id
            const delProduct = await ProductModel.findByIdAndDelete(id)
            if (!delProduct) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Product data not found"
                })

            }
            return res.status(errorCode.Success).json({
                status: true,
                message: "Data deleted successfully"
            })
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }


    }



    //soft delete
    async softDelete(req, res) {
        try {
            const id = req.params.id
            const softDel = await ProductModel.findByIdAndUpdate(id, {
                deleted: true,
                deletedAt: new Date()
            })

            // res.redirect('/api/dashboard')
            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Deleted successfully",
                data: softDel
            })
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            })
        }

    }



  async searchProducts(req, res) {
        try {
            const keyword = req.query.keyword?.trim();

            if (!keyword) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: "Keyword is required",
                });
            }

            const searchRegex = new RegExp(keyword, 'i'); 
            const data = await ProductModel.find({
                deleted: false,
                $or: [
                    { productName: searchRegex },
                    { brandName: searchRegex }
                ]
            });

            // return res.render('dashboard', {
            //     data,
            //     keyword,
            //     message: data.length ? null : 'No matching products found',
            //      user: req.user
            // });

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "Search result fetched",
                total: data.length,
                data: data,
            });
        } catch (error) {
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }




}

module.exports = new ProducApiController()