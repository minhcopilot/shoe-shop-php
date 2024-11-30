import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authAPI from "../../api/authApi";
import paymentAPI from "../../api/paymentApi";
import userAPI from "../../api/userApi";
import { getAllUser, getUser } from "../slices/userSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      return await authAPI.login(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await authAPI.register(data);

      dispatch(getAllUser());

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await userAPI.updateUser(data);

      dispatch(getUser(data.id));

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const payment = createAsyncThunk(
  "user/payment",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = paymentAPI.addPayment(data);

      return result;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    token: localStorage.getItem('token') || null, // Khôi phục token từ localStorage
  },
  reducers: {
    clearUser: (state) => {
      state.user = {};
      state.token = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      localStorage.setItem("is_admin", action.payload.data.user.is_admin);
      state.user = action.payload.data.user;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.user = action.payload.data.user;
    },
    [signUp.fulfilled]: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { clearUser, setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
