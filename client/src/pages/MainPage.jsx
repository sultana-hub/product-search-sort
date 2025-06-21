

import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Card, CardContent, CardMedia, Button, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { getAllProducts, deleteProduct, searchProduct } from '../components/QueryFunction/CrudProducts';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';

const normalizeArray = (value) =>
    Array.isArray(value)
        ? value.flatMap(v => v.split(',').map(s => s.trim().toLowerCase()))
        : value.split(',').map(s => s.trim().toLowerCase());





const MainPage = ({ filters }) => {

    const navigate = useNavigate();
    const isAuthenticated = window.sessionStorage.getItem("token")
    // Infinite Query (Pagination)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ({ pageParam = 1 }) => getAllProducts({ pageParam }),
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextPage : undefined
    });

    // Flatten all loaded pages
    const allProducts = data?.pages.flatMap(page => page?.products || []) || [];
    console.log("All products before filtering:", allProducts);


    // Apply filter
    const filteredProducts = allProducts?.filter((item) => {
        console.log("FILTERS:", filters);

        console.log("Checking:", {
            productName: item.productName,
            productSizes: item.productSize,
            selectedFilterSizes: filters.sizes,
        });


        const normalizedColor = normalizeArray(item.productColor)

        const matchesColor = !filters?.colors?.length ||
            filters.colors.find(color => normalizedColor.includes(color.toLowerCase()))

        const normalizedSizes = normalizeArray(item.productSize);
        const matchesSize =
            !filters?.sizes?.length ||
            filters.sizes.find(size =>
                normalizedSizes.includes(size.toLowerCase())
            );

        const matchesPrice = Number(item?.productPrice) >= filters.priceRange[0] &&
            Number(item.productPrice) <= filters.priceRange[1];

        const matchesBrand =
            filters?.brand?.length === 0 ||
            filters.brand.some(
                (brand) => brand.toLowerCase().trim() === item?.brandName?.toLowerCase().trim()
            );

        return matchesColor && matchesSize && matchesPrice && matchesBrand;
    });



    // Delete Mutation
    const { mutate: mutateDel } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            alert('Product deleted successfully');
            window.location.reload();
        },
        onError: (error) => console.error(error)
    });

    const handleDelete = (id) => mutateDel(id);
    const handleEdit = (id) => navigate(`update/${id}`);
    const handleDetails = (id) => navigate(`details/${id}`);

    // Search logic
    const [keyword, setKeyword] = useState('');
    const [shouldSearch, setShouldSearch] = useState(false);

    const { data: searchdata, refetch } = useQuery({
        queryKey: ['searchProducts', keyword],
        queryFn: () => searchProduct(keyword),
        enabled: false
    });





    useEffect(() => {
        if (shouldSearch && keyword.trim()) {
            refetch();
            setShouldSearch(false);
        }
    }, [keyword, shouldSearch]);




    const handleSearch = (term) => {
        if (!term.trim()) return;
        setKeyword(term);
        setShouldSearch(true);
    };




    const productList = keyword ? searchdata?.data || [] : filteredProducts;

    console.log("Final Filtered Products:", filteredProducts);

    // UI starts here
    if (isLoading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 6 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ textAlign: 'center', mt: 6 }}>
                <Typography variant="h6" color="error">
                    Failed to load products.
                </Typography>
            </Container>
        );
    }

    return (

        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Search Form */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <SearchForm onSearch={handleSearch} />
            </Box>

            {/* Product Grid */}
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {productList?.length ? (
                    productList.map((item, index) => (
                        <Grid item xs={4} sm={4} md={4} key={index}>
                            <Card
                                sx={{
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.03)' },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    src={item.image ? `http://localhost:3005/${item.image}` : '/images/khadi.jpg'}
                                    height="200"
                                    alt="product"
                                />
                                <CardContent>
                                    <Typography variant="body2" fontWeight="bold" gutterBottom noWrap>
                                        Name: {item.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        Brand: {item.brandName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        Description: {item.productDesc}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Colors: {item?.productColor?.join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Size: {item?.productSize?.join(', ')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: ₹{item?.productPrice}
                                    </Typography>
                                </CardContent>
                                <Box
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleDetails(item._id)}>
                                        View Details
                                    </Button>
                                    {
                                        isAuthenticated && (
                                            <>
                                                <Button variant="contained" color="warning" size="small" onClick={() => handleEdit(item._id)}>
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="error" size="small" onClick={() => handleDelete(item._id)}>
                                                    Delete
                                                </Button>
                                            </>)
                                    }

                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                            No products found
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Load More Button */}
            {!keyword && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            } else {
                                alert('No more products available.');
                            }
                        }}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More Products'}
                    </Button>
                </Box>
            )}
        </Container>

    );
};

export default MainPage;


