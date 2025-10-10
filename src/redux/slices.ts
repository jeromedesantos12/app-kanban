import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";
import { SessionType } from "../types/session";

export const fetchSession = createAsyncThunk(
  "token/fetchSession",
  async (_, { rejectWithValue }) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      return rejectWithValue(error.message);
    }
    return session;
  }
);

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    data: null as SessionType | null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    setSession: (state, action: PayloadAction<SessionType>) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearSession: (state) => {
      state.data = null;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.status = "loading";
        state.data = null;
        state.error = null;
      })
      .addCase(
        fetchSession.fulfilled,
        (state, action: PayloadAction<SessionType | null>) => {
          state.data = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(fetchSession.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || (action.error.message as string);
      });
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
