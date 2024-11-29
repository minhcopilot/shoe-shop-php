import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productAPI from '../../api/productApi'
import uploadAPI from '../../api/uploadApi'

export const getAllProduct = createAsyncThunk(
	'product/getAllProduct',
	async (_, { rejectWithValue }) => {
		try {
			return await productAPI.getAllProduct()
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const getProduct = createAsyncThunk(
	'product/getProduct',
	async (id, { rejectWithValue }) => {
		try {
			console.log(id)

			return await productAPI.getProduct(id)
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const addProduct = createAsyncThunk(
	'product/addProduct',
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
	'product/updateProduct',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			const result = await productAPI.updateProduct(data)

			dispatch(getAllProduct())

			return result
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const deleteProduct = createAsyncThunk(
	'product/deleteProduct',
	async (id, { rejectWithValue, dispatch }) => {
		try {
			const result = await productAPI.deleteProduct(id)

			dispatch(getAllProduct())

			return result
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const upload = createAsyncThunk('product/upload', async (files) => {
	return await uploadAPI.upload(files)
})

const initialState = {
	products: [],
	productsLoading: false,
	product: {},
	productLoading: false,
}

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {},
	extraReducers: {
		[getAllProduct.pending]: (state) => {
			state.productsLoading = true
		},
		[getAllProduct.fulfilled]: (state, action) => {
			state.productsLoading = false
			console.log(action.payload);
			state.products = action.payload
		},
		[getProduct.pending]: (state) => {
			state.productLoading = true
		},
		[getProduct.fulfilled]: (state, action) => {
			state.productLoading = false
			state.product = action.payload
		},
		[addProduct.fulfilled]: (state, action) => {
			state.categoriesLoading = false
			console.log(action.payload);
			state.categories = action.payload
		},
	},
})

export default productSlice.reducer
