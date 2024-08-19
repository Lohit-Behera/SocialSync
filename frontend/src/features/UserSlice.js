import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchLogin = createAsyncThunk('user/login', async (user, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
        };
        const { data } = await axios.post(
            `${baseUrl}/api/user/login/`,
            user,
            config
        );

        document.cookie = `userInfoSocialSync=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${30 * 24 * 60 * 60}; secure;`;
        
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        );
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

const userInfoCookie = getCookie('userInfoSocialSync');

export const fetchRegister = createAsyncThunk('user/register', async (user, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };

        const { data } = await axios.post(
            `${baseUrl}/api/user/register/`,
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
            `${baseUrl}/api/user/details/${id}/`,
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
            `${baseUrl}/api/user/update/${user.id}/`,
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
            `${baseUrl}/api/user/details/unknown/${id}/`,
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
            `${baseUrl}/api/user/list/following/`,
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
            `${baseUrl}/api/user/others/profile/${id}/`,
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

export const fetchForgetPasswordSubmit = createAsyncThunk('user/forget', async (email, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            `${baseUrl}/api/user/forget/`,
            email,
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

export const fetchForgetPasswordVerify = createAsyncThunk('user/forget/verify', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            `${baseUrl}/api/user/reset-password/verify/`,
            userData,
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

export const fetchReSendVerifyEmail = createAsyncThunk('user/resend', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `${baseUrl}/api/user/resend/verify/`,
            {},
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

export const fetchGetFollowerFollowingList = createAsyncThunk('user/following/followers', async (type, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `${baseUrl}/api/user/get/followers/following/${type.id}/?type=${type.type}`,
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
        userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
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

        forgetPasswordSubmit: null,
        forgetPasswordSubmitStatus: "idle",
        forgetPasswordSubmitError: null,

        forgetPasswordVerify: null,
        forgetPasswordVerifyStatus: "idle",
        forgetPasswordVerifyError: null,

        reSendVerifyEmail: null,
        reSendVerifyEmailStatus: "idle",
        reSendVerifyEmailError: null,

        getFollowerFollowingList: null,
        getFollowerFollowingListStatus: "idle",
        getFollowerFollowingListError: null
    },
    reducers: {
        logout: (state) => {
            document.cookie = "userInfoSocialSync=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
        },
        resetForgetPasswordSubmit: (state) => {
            state.forgetPasswordSubmit = null;
            state.forgetPasswordSubmitStatus = "idle";
            state.forgetPasswordSubmitError = null;
        },
        resetForgetPasswordVerify: (state) => {
            state.forgetPasswordVerify = null;
            state.forgetPasswordVerifyStatus = "idle";
            state.forgetPasswordVerifyError = null;
        },
        resetReSendVerifyEmail: (state) => {
            state.reSendVerifyEmail = null;
            state.reSendVerifyEmailStatus = "idle";
            state.reSendVerifyEmailError = null;
        },
        resetGetFollowerFollowingList: (state) => {
            state.getFollowerFollowingList = null;
            state.getFollowerFollowingListStatus = "idle";
            state.getFollowerFollowingListError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
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

            // Register
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

            // User Details
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

            // User Update
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

            // User Details Unknown
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

            // Following List
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

            // Other Profile
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

            // Forget Password Submit
            .addCase(fetchForgetPasswordSubmit.pending, (state) => {
                state.forgetPasswordSubmitStatus = "loading";
            })
            .addCase(fetchForgetPasswordSubmit.fulfilled, (state, action) => {
                state.forgetPasswordSubmitStatus = "succeeded";
                state.forgetPasswordSubmit = action.payload;
            })
            .addCase(fetchForgetPasswordSubmit.rejected, (state, action) => {
                state.forgetPasswordSubmitStatus = "failed";
                state.forgetPasswordSubmitError = action.payload;
            })

            // Forget Password Verify
            .addCase(fetchForgetPasswordVerify.pending, (state) => {
                state.forgetPasswordVerifyStatus = "loading";
            })
            .addCase(fetchForgetPasswordVerify.fulfilled, (state, action) => {
                state.forgetPasswordVerifyStatus = "succeeded";
                state.forgetPasswordVerify = action.payload;
            })
            .addCase(fetchForgetPasswordVerify.rejected, (state, action) => {
                state.forgetPasswordVerifyStatus = "failed";
                state.forgetPasswordVerifyError = action.payload;
            })

            // ReSend Verify Email
            .addCase(fetchReSendVerifyEmail.pending, (state) => {
                state.reSendVerifyEmailStatus = "loading";
            })
            .addCase(fetchReSendVerifyEmail.fulfilled, (state, action) => {
                state.reSendVerifyEmailStatus = "succeeded";
                state.reSendVerifyEmail = action.payload;
            })
            .addCase(fetchReSendVerifyEmail.rejected, (state, action) => {
                state.reSendVerifyEmailStatus = "failed";
                state.reSendVerifyEmailError = action.payload;
            })

            // Get Follower Following List
            .addCase(fetchGetFollowerFollowingList.pending, (state) => {
                state.getFollowerFollowingListStatus = "loading";
            })
            .addCase(fetchGetFollowerFollowingList.fulfilled, (state, action) => {
                state.getFollowerFollowingListStatus = "succeeded";
                state.getFollowerFollowingList = action.payload;
            })
            .addCase(fetchGetFollowerFollowingList.rejected, (state, action) => {   
                state.getFollowerFollowingListStatus = "failed";
                state.getFollowerFollowingListError = action.payload;
            })
    },      
});


export const { logout, resetRegister, resetUserUpdate, resetFollowingList, resetForgetPasswordSubmit, resetForgetPasswordVerify, resetReSendVerifyEmail, resetGetFollowerFollowingList } = userSlice.actions

export default userSlice.reducer