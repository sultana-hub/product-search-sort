import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../components/QueryFunction/CrudProducts';

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

const CreateProduct = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product created successful.',
        timer: 2000,
        showConfirmButton: false
      });

      reset();
      navigate('/');
    },
    onError: (error) => {
      console.error('❌ Product creation Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Product creation Failed',
        text: error?.response?.data?.message || 'Something went wrong',
      });
    }
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('productName', data?.productName);
    formData.append('productPrice', data?.productPrice);
    formData.append('productDesc', data?.productDesc);
    formData.append('productColor', data?.productColor);
    formData.append('productSize', data?.productSize);
    formData.append('brandName', data?.brandName)
    formData.append('image', data.image[0]); // single image file
    mutation.mutate(formData);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }}>
      <Typography variant="h5" textAlign="center" gutterBottom fontWeight="bold">
        Product Creation
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        {/* Name */}
        <TextField
          fullWidth
          margin="normal"
          label="Product Name"
          type="text"
          {...register('productName', { required: 'Name is required' })}
          error={!!errors?.productName}
          helperText={errors?.productName?.message}
        />

        {/* Email */}
        <TextField
          fullWidth
          margin="normal"
          label="price"
          type="text"
          {...register('productPrice', { required: 'Price is required' })}
          error={!!errors.productPrice}
          helperText={errors.productPrice?.message}
        />

        {/* Password */}
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          type="text"
          multiline
          rows={2}
          {...register('productDesc', { required: 'Description is required' })}
          error={!!errors?.productDesc}
          helperText={errors?.productDesc?.message}
        />

        {/* Phone */}
        <TextField
          fullWidth
          margin="normal"
          label="Color(comma separated)"
          type="tel"
          {...register('productColor', { required: 'Color is required' })}
          error={!!errors?.productColor}
          helperText={errors?.productColor?.message}
        />
        <TextField
          fullWidth
          label="Size(Large, Medium, Small)"
          type="text"
          marging="normal"
          {
          ...register('productSize', {
            required: "Size required"
          }
          )}
          error={!!errors?.productSize}
          helperText={errors?.productSize?.message}
        />
        <TextField
          fullWidth
          label="Brand Name"
          type="text"
          {
          ...register('brandName', {
            required: "Brand name required"
          })
          }
          error={!!errors?.brandName}
          helperText={errors?.brandName?.message}
        />


        {/* Image Upload */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Product Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            {...register('image', { required: 'Image is required' })}
            style={{ display: 'block' }}
          />
          {errors?.image && (
            <Typography variant="caption" color="error">
              {errors?.image?.message}
            </Typography>
          )}
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={mutation.isLoading}
            startIcon={mutation.isLoading && <CircularProgress size={20} />}
          >
            {mutation.isLoading ? 'Submitting...' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateProduct;