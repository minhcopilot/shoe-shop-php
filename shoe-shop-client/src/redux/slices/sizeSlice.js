import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import sizeAPI from '../../api/sizeApi'

export const getAllSize = createAsyncThunk(
	'size/getAllSize',
	async (_, { rejectWithValue }) => {
		try {
			return await sizeAPI.getAllSize()
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const getSize = createAsyncThunk(
	'size/getSize',
	async (id, { rejectWithValue }) => {
		try {
			return await sizeAPI.getSize(id)
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const addSize = createAsyncThunk(
	'size/addSize',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			const result = await sizeAPI.addSize(data)

			dispatch(getAllSize())

			return result
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const updateSize = createAsyncThunk(
	'size/updateSize',
	async (data, { rejectWithValue, dispatch }) => {
		try {
			const result = await sizeAPI.updateSize(data)

			dispatch(getAllSize())

			return result
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

export const deleteSize = createAsyncThunk(
	'size/deleteSize',
	async (id, { rejectWithValue, dispatch }) => {
		try {
			const result = await sizeAPI.deleteSize(id)

			dispatch(getAllSize())

			return result
		} catch (error) {
			return rejectWithValue(error.response)
		}
	}
)

const initialState = {
	sizes: [],
	sizesLoading: false,
	size: {},
	sizeLoading: false,
}

const sizeSlice = createSlice({
	name: 'size',
	initialState,
	reducers: {},
	extraReducers: {
		[getAllSize.pending]: (state) => {
			state.categoriesLoading = true
		},
		[getAllSize.fulfilled]: (state, action) => {
			state.sizesLoading = false;
			const data = action.payload?.data;
			if (Array.isArray(data)) {
			  state.sizes = data.map((size) => ({
				...size,
				createdAt: new Date(size.created_at).toISOString(),
				updatedAt: new Date(size.updated_at).toISOString(),
			  }));
			} else {
			  state.sizes = [];
			}
		  },
		[addSize.fulfilled]: (state, action) => {
			state.categoriesLoading = false
			state.categories = action.payload
		},
		[updateSize.fulfilled]: (state, action) => {
			console.log(action.payload)
			state.categoriesLoading = false
			state.categories = action.payload
		},
		[deleteSize.fulfilled]: (state, action) => {
			console.log(action.payload)
			state.categoriesLoading = false
			state.categories = action.payload
		},
	},
})

export default sizeSlice.reducer
