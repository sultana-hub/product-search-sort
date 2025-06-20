
import axiosInstance from '../../api/axiosInstance';
import { endPoints } from '../../api/api-url';

// export const getAllProducts = async () => {
//     const res = await axiosInstance.get(endPoints.list);
//     return res.data;
// };


// getAllProducts.js
export const getAllProducts = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(`${endPoints.list}?page=${pageParam}&limit=6`);

  const result = response.data;

  return {
    products: result.data,        // product array
    hasMore: result.hasMore,     // boolean from backend
    nextPage: result.nextPage    // number from backend
  };
};



export const createProduct = async (studentData) => {
    const response = await axiosInstance.post(endPoints.create, studentData,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    })
    console.log("Product data",response?.data)
    return response?.data
}


export const getSingleProduct = async (id) => {
    const response = await axiosInstance.get(`${endPoints.single}/${id}`)
    console.log("response from api", response)
    return response.data
}

export const updateProduct = async ({ id, data }) => {

  const res=await  axiosInstance.post(`${endPoints.update}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res
};



export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endPoints.delete}/${id}`);
        return response.data; // Return the actual data from the response
    } catch (error) {
        console.error('Delete error:', error.message);
        throw new Error('Failed to delete user'); // Throwing error for higher level handling
    }
};

// export const searchProduct = async (keyword) => {
//   const response = await axiosInstance.get(`${endPoints.search}?keyword=${keyword}`);
//   return response.data;
// };
export const searchProduct = async (keyword) => {

  const response = await axiosInstance.get(endPoints.search, {
    params: { keyword },
  });
  console.log("search product data",response)
  return response?.data;
};


