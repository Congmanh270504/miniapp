import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { prisma } from "@/utils/prisma";
import { PrismaClient } from "@prisma/client";
import { GenresType } from "../../../types/collection-types";

const initialState: GenresType[] = [];

export const fetchGenres = createAsyncThunk("genres/fetchGenres", async () => {
  const response = await fetch("/api/genres");
  const data = await response.json();
  return data;
});

export const genreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGenres.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default genreSlice.reducer;
