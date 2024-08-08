import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSupport = createAsyncThunk('support', async (message, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.put(
            '/api/user/support/',
            message,
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

export const fetchSupportGetAll = createAsyncThunk('support/get/all', async (keyword = '', { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/get/all/support/${keyword}`,
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

export const fetchSupportGetById = createAsyncThunk('support/get/id', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/support/${id}/`,
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

export const fetchSupportUpdate = createAsyncThunk('support/update', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/user/support/update/${id}/`,
            id,
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

const supportSlice = createSlice({
    name: 'support',
    initialState: {
        support: null,
        supportStatus: 'idle',
        supportError: null,

        getAllSupport: null,
        getAllSupportStatus: 'idle',
        getAllSupportError: null,

        getSupportById: null,
        getSupportByIdStatus: 'idle',
        getSupportByIdError: null,

        updateSupport: null,
        updateSupportStatus: 'idle',
        updateSupportError: null
    },
    reducers: {
        resetSupport: (state) => {
            state.support = null;
            state.supportStatus = 'idle';
            state.supportError = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSupport.pending, (state) => {
                state.supportStatus = 'loading';
            })
            .addCase(fetchSupport.fulfilled, (state, action) => {
                state.supportStatus = 'succeeded';
                state.support = action.payload;
            })
            .addCase(fetchSupport.rejected, (state, action) => {
                state.supportStatus = 'failed';
                state.supportError = action.payload;
            })

            .addCase(fetchSupportGetAll.pending, (state) => {
                state.getAllSupportStatus = 'loading';
            })
            .addCase(fetchSupportGetAll.fulfilled, (state, action) => {
                state.getAllSupportStatus = 'succeeded';
                state.getAllSupport = action.payload;
            })
            .addCase(fetchSupportGetAll.rejected, (state, action) => {
                state.getAllSupportStatus = 'failed';
                state.getAllSupportError = action.payload;
            })

            .addCase(fetchSupportGetById.pending, (state) => {
                state.getSupportByIdStatus = 'loading';
            })
            .addCase(fetchSupportGetById.fulfilled, (state, action) => {
                state.getSupportByIdStatus = 'succeeded';
                state.getSupportById = action.payload;
            })
            .addCase(fetchSupportGetById.rejected, (state, action) => {
                state.getSupportByIdStatus = 'failed';
                state.getSupportByIdError = action.payload;
            })

            .addCase(fetchSupportUpdate.pending, (state) => {
                state.updateSupportStatus = 'loading';
            })
            .addCase(fetchSupportUpdate.fulfilled, (state, action) => {
                state.updateSupportStatus = 'succeeded';
                state.updateSupport = action.payload;
            })
            .addCase(fetchSupportUpdate.rejected, (state, action) => {
                state.updateSupportStatus = 'failed';
                state.updateSupportError = action.payload;
            })
    }
})

export const { resetSupport } = supportSlice.actions
export default supportSlice.reducer