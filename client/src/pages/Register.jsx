import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../components/QueryFunction/AuthFunction';

import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';

const Register = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const mutation = useMutation({
        mutationFn: userRegister,
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your registration was successful.',
                timer: 2000,
                showConfirmButton: false
            });

            reset();
            navigate('/login');
        },
        onError: (error) => {
            console.error('❌ Register Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error?.response?.data?.message || 'Something went wrong',
            });
        }
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phone', data.phone);
        formData.append('image', data.image[0]); // single image file

        mutation.mutate(formData);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10, mb: 6 }}>
            <Typography variant="h5" textAlign="center" gutterBottom fontWeight="bold">
                User Registration
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                {/* Name */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                />

                {/* Email */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                {/* Password */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                {/* Phone */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                />

                {/* Image Upload */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Profile Image
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image', { required: 'Image is required' })}
                        style={{ display: 'block' }}
                    />
                    {errors.image && (
                        <Typography variant="caption" color="error">
                            {errors.image.message}
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

export default Register;
