import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLogin = createAsyncThunk('user/login', async (user, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const { data } = await axios.post(
            '/api/user/login/',
            user,
            config
        );

        localStorage.setItem('userInfo', JSON.stringify(data));
        
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.detail
                ? error.response.data.detail
                : error.detail
        );
    }
});

export const fetchRegister = createAsyncThunk('user/register', async (user, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };

        const { data } = await axios.post(
            '/api/user/register/',
            user,
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
});

export const fetchUserDetails = createAsyncThunk('user/details', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/details/${id}/`,
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
});

export const fetchUserUpdate = createAsyncThunk('user/update', async (user, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/user/update/${user.id}/`,
            user,
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
});

export const fetchUserDetailsUnknown = createAsyncThunk('user/unknown', async (id, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `/api/user/details/unknown/${id}/`,
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
});

export const fetchFollowingList = createAsyncThunk('user/following', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/list/following/`,
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
});

export const fetchOtherProfile = createAsyncThunk('user/other', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/user/others/profile/${id}/`,
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


const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
        userInfoStatus: "idle",
        userInfoError: null,

        register: null,
        registerStatus: "idle",
        registerError: null,

        userDetails: null,
        userDetailsStatus: "idle",
        userDetailsError: null,

        userUpdate: null,
        userUpdateStatus: "idle",
        userUpdateError: null,

        userDetailsUnknown: null,
        userDetailsUnknownStatus: "idle",
        userDetailsUnknownError: null,

        followingList: null,
        followingListStatus: "idle",
        followingListError: null,

        otherProfile: null,
        otherProfileStatus: "idle",
        otherProfileError: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("userInfo");
            state.userInfo = null;
            state.userInfoStatus = "idle";
            state.userInfoError = null;
        },
        resetRegister: (state) => {
            state.register = null;
            state.registerStatus = "idle";
            state.registerError = null;
        },
        resetUserUpdate: (state) => {
            state.userUpdate = null;
            state.userUpdateStatus = "idle";
            state.userUpdateError = null;
        },
        resetFollowingList: (state) => {
            state.followingList = null;
            state.followingListStatus = "idle";
            state.followingListError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.userInfoStatus = "loading";
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.userInfoStatus = "succeeded";
                state.userInfo = action.payload;
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.userInfoStatus = "failed";
                state.userInfoError = action.payload;
            })

            .addCase(fetchRegister.pending, (state) => {
                state.registerStatus = "loading";
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.registerStatus = "succeeded";
                state.register = action.payload;
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.registerStatus = "failed";
                state.registerError = action.payload;
            })

            .addCase(fetchUserDetails.pending, (state) => {
                state.userDetailsStatus = "loading";
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.userDetailsStatus = "succeeded";
                state.userDetails = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.userDetailsStatus = "failed";
                state.userDetailsError = action.payload;
            })

            .addCase(fetchUserUpdate.pending, (state) => {
                state.userUpdateStatus = "loading";
            })
            .addCase(fetchUserUpdate.fulfilled, (state, action) => {
                state.userUpdateStatus = "succeeded";
                state.userUpdate = action.payload;
            })
            .addCase(fetchUserUpdate.rejected, (state, action) => {
                state.userUpdateStatus = "failed";
                state.userUpdateError = action.payload;
            })

            .addCase(fetchUserDetailsUnknown.pending, (state) => {
                state.userDetailsUnknownStatus = "loading";
            })
            .addCase(fetchUserDetailsUnknown.fulfilled, (state, action) => {
                state.userDetailsUnknownStatus = "succeeded";
                state.userDetailsUnknown = action.payload;
            })
            .addCase(fetchUserDetailsUnknown.rejected, (state, action) => {
                state.userDetailsUnknownStatus = "failed";
                state.userDetailsUnknownError = action.payload;
            })

            .addCase(fetchFollowingList.pending, (state) => {
                state.followingListStatus = "loading";
            })
            .addCase(fetchFollowingList.fulfilled, (state, action) => {
                state.followingListStatus = "succeeded";
                state.followingList = action.payload;
            })
            .addCase(fetchFollowingList.rejected, (state, action) => {
                state.followingListStatus = "failed";
                state.followingListError = action.payload;
            })

            .addCase(fetchOtherProfile.pending, (state) => {
                state.otherProfileStatus = "loading";
            })
            .addCase(fetchOtherProfile.fulfilled, (state, action) => {
                state.otherProfileStatus = "succeeded";
                state.otherProfile = action.payload;
            })
            .addCase(fetchOtherProfile.rejected, (state, action) => {
                state.otherProfileStatus = "failed";
                state.otherProfileError = action.payload;
            })
    },
});


export const { logout, resetRegister, resetUserUpdate, resetFollowingList } = userSlice.actions

export default userSlice.reducer