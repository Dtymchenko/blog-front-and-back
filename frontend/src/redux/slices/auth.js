import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../helpers/axios";

export const fetchAuth = createAsyncThunk(
  "/auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);

// export const fetchRegister = createAsyncThunk(
//   "/auth/fetchRegister",
//   async (params) => {
//     const { data } = await axios.post("/auth/register", params);
//     return data;
//   }
// );

export const fetchRegister = createAsyncThunk(
  "/auth/fetchRegister",
  async (params) => {
    try {
      const { data } = await axios.post("/auth/register", params);
      return data;
    } catch (error) {
      return { error: error.response.data };
    }
  }
);

export const fetchLogin = createAsyncThunk("/auth/fetchlLogin", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = "loaded";
      localStorage.removeItem("token");
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      if (!action.payload.error) {
        state.data = action.payload;
      }
    },
    [fetchAuth.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchLogin.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.status = "loaded";
      if (!action.payload.error) {
        state.data = action.payload;
      }
    },
    [fetchLogin.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      if (!action.payload.error) {
        state.data = action.payload;
      }
    },
    [fetchRegister.rejected]: (state) => {
      state.status = "error";
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
