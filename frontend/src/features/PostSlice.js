import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCreatePost = createAsyncThunk('create/post', async (post, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            '/api/post/create/',
            post,
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


export const fetchGetPost = createAsyncThunk('get/post', async (id, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `/api/post/get/post/${id}/`,
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

export const fetchGetUserAllTextPost = createAsyncThunk('get/user/all/textPost', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/user/${id}/`,
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

export const fetchDeletePost = createAsyncThunk('delete/post', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.delete(
            `/api/post/delete/${id}/`,
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

export const fetchEditTextPost = createAsyncThunk('edit/textPost', async (textPost, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/post/edit/text/${textPost.id}/`,
            textPost,
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

export const fetchGetAllVideoPost = createAsyncThunk('get/all/videoPost', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            '/api/post/get/all/video/',
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

export const fetchGetAllImagePost = createAsyncThunk('get/all/imagePost', async (page=1, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/all/images/?page=${page}`,
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

export const fetchGetAllTextPost = createAsyncThunk('get/all/textPost', async (page=1, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/all/text/?page=${page}`,
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

const PostSlice = createSlice({
    name: "post",
    initialState: {
        createPost: {},
        createPostStatus: 'idle',
        createPostError: null,

        getPost: {},
        getPostStatus: 'idle',
        getPostError: null,

        getAllTextPost: {},
        getAllTextPostStatus: 'idle',
        getAllTextPostError: null,

        getAllVideoPost: {},
        getAllVideoPostStatus: 'idle',
        getAllVideoPostError: null,

        getAllImagePost: [],
        getAllImagePostStatus: 'idle',
        getAllImagePostError: null,

        getUserAllTextPost: {},
        getUserAllTextPostStatus: 'idle',
        getUserAllTextPostError: null,

        deletePost: null,
        deletePostStatus: 'idle',
        deletePostError: null,

        editTextPost: null,
        editTextPostStatus: 'idle',
        editTextPostError: null,

    },
    reducers: {
        resetCreatePost: (state) => {
            state.createPost = {};
            state.createPostStatus = 'idle';
            state.createPostError = null;
        },
        resetGetAllImagePost: (state) => {
            state.getAllImagePost = [];
            state.getAllImagePostStatus = 'idle';
            state.getAllImagePostError = null;
        },
        resetGetAllVideoPost: (state) => {
            state.getAllVideoPost = {};
            state.getAllVideoPostStatus = 'idle';
            state.getAllVideoPostError = null;
        },
        resetGetAllTextPost: (state) => {
            state.getAllTextPost = {};
            state.getAllTextPostStatus = 'idle';
            state.getAllTextPostError = null;
        },
        resetDeleteTextPost: (state) => {
            state.deletePost = null;
            state.deletePostStatus = 'idle';
            state.deletePostError = null;
        },
        resetEditTextPost: (state) => {
            state.editTextPost = null;
            state.editTextPostStatus = 'idle';
            state.editTextPostError = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Create Text Post
            .addCase(fetchCreatePost.pending, (state) => {
                state.createPostStatus = 'loading';
            })
            .addCase(fetchCreatePost.fulfilled, (state, action) => {
                state.createPostStatus = 'succeeded';
                state.createPost = action.payload;
            })
            .addCase(fetchCreatePost.rejected, (state, action) => {
                state.createPostStatus = 'failed';
                state.createPostError = action.payload;
            })

        // Get Text Post

            .addCase(fetchGetPost.pending, (state) => {
                state.getPostStatus = 'loading';
            })
            .addCase(fetchGetPost.fulfilled, (state, action) => {
                state.getPostStatus = 'succeeded';
                state.getPost = action.payload;
            })
            .addCase(fetchGetPost.rejected, (state, action) => {
                state.getPostStatus = 'failed';
                state.getPostError = action.payload;
            })

            // Get All Text Post
            .addCase(fetchGetAllTextPost.pending, (state) => {
                state.getAllTextPostStatus = 'loading';
            })
            .addCase(fetchGetAllTextPost.fulfilled, (state, action) => {
                state.getAllTextPostStatus = 'succeeded';
                state.getAllTextPost = action.payload;
            })
            .addCase(fetchGetAllTextPost.rejected, (state, action) => {
                state.getAllTextPostStatus = 'failed';
                state.getAllTextPostError = action.payload;
            })

            // Get All Video Post
            .addCase(fetchGetAllVideoPost.pending, (state) => {
                state.getAllVideoPostStatus = 'loading';
            })
            .addCase(fetchGetAllVideoPost.fulfilled, (state, action) => {
                state.getAllVideoPostStatus = 'succeeded';
                state.getAllVideoPost = action.payload;
            })
            .addCase(fetchGetAllVideoPost.rejected, (state, action) => {
                state.getAllVideoPostStatus = 'failed';
                state.getAllVideoPostError = action.payload;
            })

            // Get All Image Post
            .addCase(fetchGetAllImagePost.pending, (state) => {
                state.getAllImagePostStatus = 'loading';
            })
            .addCase(fetchGetAllImagePost.fulfilled, (state, action) => {
                state.getAllImagePostStatus = 'succeeded';
                state.getAllImagePost = action.payload;
            })
            .addCase(fetchGetAllImagePost.rejected, (state, action) => {
                state.getAllImagePostStatus = 'failed';
                state.getAllImagePostError = action.payload;
            })

            // Get User All Text Post
            .addCase(fetchGetUserAllTextPost.pending, (state) => {
                state.getUserAllTextPostStatus = 'loading';
            })
            .addCase(fetchGetUserAllTextPost.fulfilled, (state, action) => {
                state.getUserAllTextPostStatus = 'succeeded';
                state.getUserAllTextPost = action.payload;
            })
            .addCase(fetchGetUserAllTextPost.rejected, (state, action) => {
                state.getUserAllTextPostStatus = 'failed';
                state.getUserAllTextPostError = action.payload;
            })

            // Delete Text Post
            .addCase(fetchDeletePost.pending, (state) => {
                state.deletePostStatus = 'loading';
            })
            .addCase(fetchDeletePost.fulfilled, (state, action) => {
                state.deletePostStatus = 'succeeded';
                state.deletePost = action.payload;
            })
            .addCase(fetchDeletePost.rejected, (state, action) => {
                state.deletePostStatus = 'failed';
                state.deletePostError = action.payload;
            })

            // Edit Text Post
            .addCase(fetchEditTextPost.pending, (state) => {
                state.editTextPostStatus = 'loading';
            })
            .addCase(fetchEditTextPost.fulfilled, (state, action) => {
                state.editTextPostStatus = 'succeeded';
                state.editTextPost = action.payload;
            })
            .addCase(fetchEditTextPost.rejected, (state, action) => {
                state.editTextPostStatus = 'failed';
                state.editTextPostError = action.payload;
            })
    },
});

export const { resetCreatePost, resetGetAllImagePost, resetGetAllVideoPost, resetGetAllTextPost, resetDeletePost, resetEditTextPost } = PostSlice.actions;
export default PostSlice.reducer;