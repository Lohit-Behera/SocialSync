import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDeleteImages = createAsyncThunk('delete/images', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.delete(
            '/api/user/admin/delete/images/',
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
})

const deleteImagesSlice = createSlice({
    name: 'delete/images',
    initialState: {
        deleteImage : null,
        deleteImageStatus: 'idle',
        deleteImageError: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeleteImages.pending, (state) => {
                state.deleteImageStatus = 'loading';
            })
            .addCase(fetchDeleteImages.fulfilled, (state, action) => {
                state.deleteImageStatus = 'succeeded';
                state.deleteImage = action.payload;
            })
            .addCase(fetchDeleteImages.rejected, (state, action) => {
                state.deleteImageStatus = 'failed';
                state.deleteImageError = action.payload;
            })
    }
})
export default deleteImagesSlice.reducer