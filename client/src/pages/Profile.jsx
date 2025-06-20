import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container
} from '@mui/material';
import { usersImages } from '../api/axiosInstance';

const Profile = () => {
  const name = window.sessionStorage.getItem('name');
  const image = window.sessionStorage.getItem('image');
  const email = window.sessionStorage.getItem('email');

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Welcome to {name} Profile
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ width: 250, boxShadow: 3 }}>
          <CardMedia
            component="img"
            image={usersImages(image)}
            alt={name}
            sx={{
              width: 200,
              height: 200,
              objectFit: 'cover',
              borderRadius: 2,
              mt: 2,
              mx: 'auto'
            }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="medium">
              Name: {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {email}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile;
