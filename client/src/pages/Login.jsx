import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { userLogin } from '../components/QueryFunction/AuthFunction';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';

const Login = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const mutation = useMutation({
        mutationFn: userLogin,
        mutationKey: ['login'],
        onSuccess: (data) => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Login successful.',
                timer: 2000,
                showConfirmButton: false
            });
            console.log(' Login user data', data);
            window.sessionStorage.setItem('token', data?.token);
            window.sessionStorage.setItem('name', data?.user.name);
            window.sessionStorage.setItem('image', data?.user.image);
            window.sessionStorage.setItem('email', data?.user.email);
            reset();
            navigate('/');
        },
        onError: (error) => {
            console.error('❌ Login Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error?.response?.data?.message || 'Something went wrong',
            });
        }
    });

    const onSubmit = (formData) => {
        console.log('credentials', formData);
        mutation.mutate(formData);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 10, mb: 6 }}>
            <Box
                sx={{
                    display: { xs: 'block', md: 'flex' }, // ✅ Side-by-side on md and up
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                {/* Left Image */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        height: { xs: 200, md: 'auto' }, // Optional fixed height for small screens
                    }}
                >
                    <Box
                        component="img"
                        src="/images/login3.jpg"
                        alt="Login"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                {/* Right Form */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                        User Login
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={mutation.isLoading}
                                startIcon={mutation.isLoading && <CircularProgress size={20} />}
                            >
                                {mutation.isLoading ? 'Submitting...' : 'Login'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>



    );
};

export default Login;
