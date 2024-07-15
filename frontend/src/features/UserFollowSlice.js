import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFollowUser = createAsyncThunk('follow/user', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `/api/user/follow/${id}/`,
            {},
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.response.data
        );
    }
});

export const fetchGetFollow = createAsyncThunk('get/follow', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/list/follow/${id}/`,
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.response.data
        );
    }
});


const userFollowSlice = createSlice({
    name: 'follow',
    initialState: {
        follow: {},
        followStatus: "idle",
        followError: null,

        getFollow: [],
        getFollowStatus: "idle",
        getFollowError: null,
    },
    reducers: {
        resetFollow: (state) => {
            state.follow = {};
            state.followStatus = "idle";
            state.followError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowUser.pending, (state) => {
                state.followStatus = "loading";
            })
            .addCase(fetchFollowUser.fulfilled, (state, action) => {
                state.followStatus = "succeeded";
                state.follow = action.payload;
            })
            .addCase(fetchFollowUser.rejected, (state, action) => {
                state.followStatus = "failed";
                state.followError = action.payload;
            })

            .addCase(fetchGetFollow.pending, (state) => {
                state.getFollowStatus = "loading";
            })
            .addCase(fetchGetFollow.fulfilled, (state, action) => {
                state.getFollowStatus = "succeeded";
                state.getFollow = action.payload;
            })
            .addCase(fetchGetFollow.rejected, (state, action) => {
                state.getFollowStatus = "failed";
                state.getFollowError = action.payload;
            })
    }
});

export const { resetFollow } = userFollowSlice.actions
export default userFollowSlice.reducer