import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryAPI from "../../api/categoryApi";

export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryAPI.getAllCategory();
      return response;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id, { rejectWithValue }) => {
    try {
      return await categoryAPI.getCategory(id);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await categoryAPI.addCategory(data);

      dispatch(getAllCategory());

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await categoryAPI.updateCategory(data);

      dispatch(getAllCategory());

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const result = await categoryAPI.deleteCategory(id);

      dispatch(getAllCategory());

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const initialState = {
  categories: [],
  categoriesLoading: false,
  category: {},
  categoryLoading: false,
  addCategoryLoading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllCategory.pending]: (state) => {
      state.categoriesLoading = true;
    },
    [getAllCategory.fulfilled]: (state, action) => {
      state.categoriesLoading = false;
      state.categories = action.payload;
    },
    [getAllCategory.rejected]: (state, action) => {
      state.categoriesLoading = false;
    },
    [addCategory.pending]: (state) => {
      state.addCategoryLoading = true;
    },
    [addCategory.fulfilled]: (state, action) => {
      state.addCategoryLoading = false;
    },
    [addCategory.rejected]: (state) => {
      state.addCategoryLoading = false;
    },
  },
});

export default categorySlice.reducer;
