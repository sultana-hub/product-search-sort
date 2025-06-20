
import React, { useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Box, Typography, Slider, Select, MenuItem, FormControl, Container, CircularProgress, List, ListItemButton } from '@mui/material';
import { getAllProducts } from '../components/QueryFunction/CrudProducts';
import { useQuery } from '@tanstack/react-query';

const SideBar = ({ onFilterChange }) => {

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: getAllProducts,
    queryKey: ["brand"]
  })
  console.log(" all data ", data)

  const colors = ["Red", "Blue", "Black","Green","Pink","Yellow"];
  const sizes = ["Small", "Medium", "Large"];
  const brands = data?.products?.map((brand) => brand.brandName)
  console.log("brand", brands)






  const handleColorChange = (color) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    onFilterChange({ colors: newColors, sizes: selectedSizes, priceRange, brand: selectedBrand });
  };

  const handleSizeChange = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    onFilterChange({ colors: selectedColors, sizes: newSizes, priceRange, brand: selectedBrand });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ colors: selectedColors, sizes: selectedSizes, priceRange: newValue, brand: selectedBrand });
  };

  const handleBrandSelect = (brand) => {
    const newBrand=selectedBrand.includes(brand)
    ? selectedBrand.filter(b=>b!==brand)
    :[...selectedBrand,brand]
    setSelectedBrand(newBrand);
    onFilterChange({ colors: selectedColors, sizes: selectedSizes, priceRange, brand:newBrand });
  };


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

if (!data || !data.products) {
  console.log("⛔ Product data is undefined or incomplete.");
  return null;
}



  return (
    <Box sx={{ p: 2, mt: 5 }}>
      <Typography variant="h6" fontWeight="bold" mb={2} noWrap>Select Color</Typography>
      <FormGroup>
        {colors.map((color) => (
          <FormControlLabel
            key={color}
            control={<Checkbox checked={selectedColors.includes(color)} onChange={() => handleColorChange(color)} />}
            label={color}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" fontWeight="bold" mb={2}>Select Size</Typography>
      <FormGroup>
        {sizes.map((size) => (
          <FormControlLabel
            key={size}
            control={<Checkbox checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)} />}
            label={size}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" fontWeight="bold" mb={2}>Price Range</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
      />

      <Typography variant="h6" fontWeight="bold" mb={2} noWrap>Select Brand</Typography>
      {/* <List>
        {brands?.map((brand) => (
          <ListItemButton 
          key={brand} 
          selected={selectedBrand === brand} 
          onClick={() => handleBrandSelect(brand)}>
            {brand}
          </ListItemButton>
        ))}
      </List> */}

<FormGroup>
  {
    brands?.map((brand)=>(
      <FormControlLabel
      key={brand}
      label={brand}
      control={<Checkbox checked={selectedBrand.includes(brand)} onChange={()=>handleBrandSelect(brand)}/>}
      />
    ))
  }
</FormGroup>





    </Box>
  );
};

export default SideBar;

