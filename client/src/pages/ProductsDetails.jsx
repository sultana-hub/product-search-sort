// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { getSingleProduct } from '../components/QueryFunction/CrudProducts';
// import {
//   Box,
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   CircularProgress,
//   Container
// } from '@mui/material';

// const ProductsDetails = () => {
//   const { id } = useParams();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['single', id],
//     queryFn: () => getSingleProduct(id),
//   });
// console.log("data", data?.data);
//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Typography variant="h6" color="error" align="center" mt={4}>
//         Failed to load product
//       </Typography>
//     );
//   }

//   const product = data?.data

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Card
//         sx={{
//           boxShadow: 3,
//           borderRadius: 2,
//           height: '100%',
//           display: 'flex',
//           flexDirection: 'column',
//           transition: '0.3s',
//           '&:hover': { transform: 'scale(1.02)' },
//         }}
//       >
//         <CardMedia
//           component="img"
//           src={`http://localhost:3005/${product?.image?.replace(/\\/g, "/")}`}

//           height="300"
//           alt="product"
//         />
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             {product?.productName}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             Brand: {product?.brandName}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             Description: {product?.productDesc}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             Color: {product?.productColor?.join(', ')}
//           </Typography>
//           <Typography variant="body2" color="text.secondary" gutterBottom>
//             Size: {product?.productSize?.join(', ')}
//           </Typography>
//           <Typography variant="body1" fontWeight="bold" color="primary">
//             Price: ₹{product?.productPrice}
//           </Typography>
//         </CardContent>
//         <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
//           <Button variant="contained" color="primary">
//             Add to Cart
//           </Button>
//           <Button variant="outlined" color="secondary">
//             Buy Now
//           </Button>
//         </Box>
//       </Card>
//     </Container>
//   );
// };

// export default ProductsDetails;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSingleProduct } from '../components/QueryFunction/CrudProducts';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';

const ProductsDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['single', id],
    queryFn: () => getSingleProduct(id),
  });

  const product = data?.data;
  const [mainImage, setMainImage] = useState(null);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load product
      </Typography>
    );
  }

  const imageUrl = (imgPath) =>
    `http://localhost:3005/${imgPath?.replace(/\\/g, '/')}`;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Side: Image & thumbnails */}
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            src={imageUrl(mainImage || product?.image)}
            alt="Product"
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {product?.productImages?.map((img, index) => (
              <Box
                key={index}
                component="img"
                src={imageUrl(img)}
                alt={`Related ${index}`}
                onClick={() => setMainImage(img)}
                sx={{
                  width: 70,
                  height: 70,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: 1,
                  border: mainImage === img ? '2px solid #1976d2' : '1px solid #ccc',
                }}
              />
            ))}
          </Box>
             <Typography variant='p' sx={{justifyContent:"center"}}>Image Preview</Typography>
        </Box>
    
        {/* Right Side: Product Details */}
        <Box sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {product?.productName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Brand: {product?.brandName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product?.productDesc}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Color: {product?.productColor?.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Size: {product?.productSize?.join(', ')}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Price: ₹{product?.productPrice}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary">
                Add to Cart
              </Button>
              <Button variant="outlined" color="secondary">
                Buy Now
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Box>

    </Container>
  );
};

export default ProductsDetails;
