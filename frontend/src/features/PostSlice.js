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

export const fetchGetUserAllPost = createAsyncThunk('get/user/all/textPost', async (info, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/user/${info.id}/${info.page ? `?page=${info.page}` : ''}`,
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

export const fetchEditPost = createAsyncThunk('edit/post', async (post, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/post/edit/text/${post.id}/`,
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

export const fetchGetAllFollowingPosts = createAsyncThunk('get/all/followingPosts', async (page=1, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `/api/post/get/all/following/?page=${page}`,
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        )}
})

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

        getUserAllPost: {},
        getUserAllPostStatus: 'idle',
        getUserAllPostError: null,

        getAllFollowingPosts: {},
        getAllFollowingPostsStatus: 'idle',
        getAllFollowingPostsError: null,

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
        resetGetUserAllPost: (state) => {
            state.getUserAllPost = {};
            state.getUserAllPostStatus = 'idle';
            state.getUserAllPostError = null;
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
        resetGetAllFollowingPosts: (state) => {
            state.getAllFollowingPosts = {};
            state.getAllFollowingPostsStatus = 'idle';
            state.getAllFollowingPostsError = null;
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
            .addCase(fetchGetUserAllPost.pending, (state) => {
                state.getUserAllPostStatus = 'loading';
            })
            .addCase(fetchGetUserAllPost.fulfilled, (state, action) => {
                state.getUserAllPostStatus = 'succeeded';
                state.getUserAllPost = action.payload;
            })
            .addCase(fetchGetUserAllPost.rejected, (state, action) => {
                state.getUserAllPostStatus = 'failed';
                state.getUserAllPostError = action.payload;
            })

            // Get All following Posts
            .addCase(fetchGetAllFollowingPosts.pending, (state) => {
                state.getAllFollowingPostsStatus = 'loading';
            })
            .addCase(fetchGetAllFollowingPosts.fulfilled, (state, action) => {
                state.getAllFollowingPostsStatus = 'succeeded';
                state.getAllFollowingPosts = action.payload;
            })
            .addCase(fetchGetAllFollowingPosts.rejected, (state, action) => {
                state.getAllFollowingPostsStatus = 'failed';
                state.getAllFollowingPostsError = action.payload;
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
            .addCase(fetchEditPost.pending, (state) => {
                state.editTextPostStatus = 'loading';
            })
            .addCase(fetchEditPost.fulfilled, (state, action) => {
                state.editTextPostStatus = 'succeeded';
                state.editTextPost = action.payload;
            })
            .addCase(fetchEditPost.rejected, (state, action) => {
                state.editTextPostStatus = 'failed';
                state.editTextPostError = action.payload;
            })
    },
});

export const { resetCreatePost, resetGetUserAllPost, resetGetAllImagePost, resetGetAllVideoPost, resetGetAllTextPost, resetGetAllFollowingPosts, resetDeletePost, resetEditTextPost } = PostSlice.actions;
export default PostSlice.reducer;