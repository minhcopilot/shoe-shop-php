import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productAPI from "../../api/productApi";
import uploadAPI from "../../api/uploadApi";
import axiosimageClient from "../../api/axiosimageClient";
import axiosClient from "../../api/axiosClient";

export const getAllProduct = createAsyncThunk(
  "product/getAllProduct",
  async (_, { rejectWithValue }) => {
    try {
      return await productAPI.getAllProduct();
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getProduct = createAsyncThunk("product/getProduct", async (id) => {
  const response = await productAPI.getProduct(id);
  return response.data;
});

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue, dispatch }) => {
    console.log("Data passed to createAsyncThunk:", data); // Debug

    try {
      const result = await productAPI.addProduct(data);
      console.log("Data sent to backend:", result);
      dispatch(getAllProduct());
      return result;
    } catch (error) {
      console.error("Error in createAsyncThunk:", error.response);
      return rejectWithValue(error.response);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (data) => {
    try {
      // Kiểm tra xem data có chứa formData không
      if (data.formData) {
        const response = await axiosimageClient.post(
          `/products/${data.id}`,
          data.formData
        );
        return response.data;
      }

      // Nếu không phải FormData (chỉ có URL ảnh), sử dụng axiosClient
      const response = await axiosClient.put(`/products/${data.id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const result = await productAPI.deleteProduct(id);

      dispatch(getAllProduct());

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const upload = createAsyncThunk("product/upload", async (files) => {
  return await uploadAPI.upload(files);
});

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async () => {
    const response = await productAPI.getAll();
    return response;
  }
);

const initialState = {
  products: [],
  productsLoading: false,
  product: {},
  productLoading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllProduct.pending]: (state) => {
      state.productsLoading = true;
    },
    [getAllProduct.fulfilled]: (state, action) => {
      state.productsLoading = false;
      state.products = action.payload.data;
    },
    [getProduct.pending]: (state) => {
      state.productLoading = true;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.productLoading = false;
      state.product = action.payload;
    },
    [getProduct.rejected]: (state) => {
      state.productLoading = false;
    },
    [addProduct.fulfilled]: (state, action) => {
      state.categoriesLoading = false;
      state.categories = action.payload.data;
    },
    [getAllProducts.pending]: (state) => {
      state.loading = true;
    },
    [getAllProducts.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    [getAllProducts.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default productSlice.reducer;
