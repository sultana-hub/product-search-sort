import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct, getSingleProduct } from '../components/QueryFunction/CrudProducts';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [previewImage, setPreviewImage] = useState(null);
    const [extraImages, setExtraImages] = useState(null)
    const { data: productData, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getSingleProduct(id),
    });
    console.log("product data", productData?.data)
    const product = productData?.data;

    useEffect(() => {
        if (product) {
            reset({
                productName: product.productName,
                brandName: product.brandName,
                productDesc: product.productDesc,
                productColor: product.productColor?.join(', '),
                productSize: product.productSize?.join(', '),
                productPrice: product.productPrice,
            });
            setPreviewImage(product.image);

            setExtraImages(product.productImages);
        }
    }, [product, reset]);

    const { mutate } = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            alert('Product updated successfully!');
            navigate('/');
        },
        onError: (error) => {
            alert('Update failed: ' + error.message);
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append('productName', data?.productName);
        formData.append('brandName', data?.brandName);
        formData.append('productDesc', data?.productDesc);
        formData.append('productPrice', data?.productPrice);

        // Convert comma-separated string to arrays
        const colorArray = data?.productColor.split(',').map(c => c.trim());
        const sizeArray = data?.productSize.split(',').map(s => s.trim());

        // Append color array to FormData
        colorArray.forEach(color => formData.append('productColor[]', color));
        // Append size array to FormData
        sizeArray.forEach(size => formData.append('productSize[]', size));

        // Append image if selected
        if (data?.image && data?.image[0]) {
            formData.append('image', data.image[0]);
        }
        // multiple images
        if (data?.productImages && data?.productImages?.length > 0) {
            for (let i = 0; i < data?.productImages?.length; i++) {
                formData.append('productImages', data.productImages[i]);
            }
        }


        mutate({ id, data: formData });
    };




    if (isLoading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <Paper
            elevation={4}
            sx={{
                p: 4,
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                marginTop: 6
            }}
        >
            <Typography
                variant="h5"
                component="h1"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                }}
            >
                Update Product
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                encType="multipart/form-data"
            >
                <TextField
                    label="Product Name"
                    variant="outlined"
                    {...register('productName', {
                        required: 'Product name is required',
                        minLength: { value: 2, message: 'Minimum 2 characters' },
                    })}
                    error={!!errors.productName}
                    helperText={errors.productName?.message}
                />

                <TextField
                    label="Brand Name"
                    variant="outlined"
                    {...register('brandName', { required: 'Brand name is required' })}
                    error={!!errors.brandName}
                    helperText={errors.brandName?.message}
                />

                <TextField
                    label="Product Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    {...register('productDesc', { required: 'Description is required' })}
                    error={!!errors.productDesc}
                    helperText={errors.productDesc?.message}
                />

                <TextField
                    label="Product Color (comma-separated)"
                    variant="outlined"
                    {...register('productColor', { required: 'Product color is required' })}
                    error={!!errors.productColor}
                    helperText={errors.productColor?.message}
                />

                <TextField
                    label="Product Size (comma-separated)"
                    variant="outlined"
                    {...register('productSize', { required: 'Product size is required' })}
                    error={!!errors.productSize}
                    helperText={errors.productSize?.message}
                />

                <TextField
                    label="Product Price"
                    variant="outlined"
                    type="number"
                    {...register('productPrice', {
                        required: 'Product price is required',
                        min: { value: 1, message: 'Price must be greater than 0' },
                    })}
                    error={!!errors.productPrice}
                    helperText={errors.productPrice?.message}
                />

                {/* Image Upload Field */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Product Image
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image', {
                            required: 'Image Required'
                        })}
                        style={{ display: 'block' }}

                    />
                    {errors?.image && (
                        <Typography variant="caption" color="error">
                            {errors?.image?.message}
                        </Typography>
                    )}
                </Box>

                {/* preview if main image  */}
                {previewImage && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">Main Image Preview</Typography>
                        <img
                            src={`http://localhost:3005/${previewImage.replace(/\\/g, '/')}`}
                            alt="Main Preview"
                            style={{ width: '100%', maxWidth: 200, borderRadius: 8 }}
                        />
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Extra Product Images
                    </Typography>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        {...register('productImages', {
                            required: 'Minimum one and maximum Four images required'
                        })}
                        style={{ display: 'block' }}
                    />
                    {
                        errors?.productImages &&(
                            <Typography variant="caption" color="error">
                            {errors?.productImages?.message}
                        </Typography>
                        )
                    }
                </Box>

                {/* preview of uploaded images */}
                {product?.productImages?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Existing Extra Images
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {product.productImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:3005/${img.replace(/\\/g, '/')}`}
                                    alt={`ProductImage-${index}`}
                                    style={{ width: 70, height: 70, borderRadius: 4, objectFit: 'cover' }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                    >
                        Update Product
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 2 }}
                        onClick={() => navigate(-1)} // Go back to previous page
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default UpdateProduct;

