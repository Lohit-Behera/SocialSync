import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Like post
export const fetchLike = createAsyncThunk('like', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `/api/post/like/${id}/`,
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
})

// Create Comment
export const fetchCreateComment = createAsyncThunk('comment/create', async (comment, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/post/create/comment/${comment.id}/`,
            comment,
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

// get all comments
export const fetchGetAllComments = createAsyncThunk('get/all/comments', async (id, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `/api/post/get/comments/${id}/`,
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

//delete comment
export const fetchDeleteComment = createAsyncThunk('delete/comment', async (id, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.delete(
            `/api/post/delete/comment/${id}/`,
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

// edit comment
export const fetchEditComment = createAsyncThunk('edit/comment', async (comment, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(
            `/api/post/edit/comment/${comment.id}/`,
            comment,
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

const PostRelatedSlice = createSlice({
    name: 'postRelated',
    initialState: {
        postLike: {},
        postLikeStatus: 'idle',
        postLikeError: null,

        createComment: null,
        createCommentStatus: 'idle',
        createCommentError: null,

        getAllComments: [],
        getAllCommentsStatus: 'idle',
        getAllCommentsError: null,

        deleteComment: null,
        deleteCommentStatus: 'idle',
        deleteCommentError: null,

        editComment: null,
        editCommentStatus: 'idle',
        editCommentError: null,
    },
    reducers:{
        resetLike: (state) => {
            state.postLike = {};
            state.postLikeStatus = 'idle';
            state.postLikeError = null;
        },
        resetCreateComment: (state) => {
            state.createComment = null;
            state.createCommentStatus = 'idle';
            state.createCommentError = null;
        },
        resetDeleteComment: (state) => {
            state.deleteComment = null;
            state.deleteCommentStatus = 'idle';
            state.deleteCommentError = null;
        },
        resetEditComment: (state) => {
            state.editComment = null;
            state.editCommentStatus = 'idle';
            state.editCommentError = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Like Post
            .addCase(fetchLike.pending, (state) => {
                state.postLikeStatus = 'loading';
            })
            .addCase(fetchLike.fulfilled, (state, action) => {
                state.postLikeStatus = 'succeeded';
                state.postLike = action.payload;
            })
            .addCase(fetchLike.rejected, (state, action) => {
                state.postLikeStatus = 'failed';
                state.postLikeError = action.payload;
            })

        // Create Comment
            .addCase(fetchCreateComment.pending, (state) => {
                state.createCommentStatus = 'loading';
            })
            .addCase(fetchCreateComment.fulfilled, (state, action) => {
                state.createCommentStatus = 'succeeded';
                state.createComment = action.payload;
            })
            .addCase(fetchCreateComment.rejected, (state, action) => {
                state.createCommentStatus = 'failed';
                state.createCommentError = action.payload;
            })

        // Get All Comments
            .addCase(fetchGetAllComments.pending, (state) => {
                state.getAllCommentsStatus = 'loading';
            })
            .addCase(fetchGetAllComments.fulfilled, (state, action) => {
                state.getAllCommentsStatus = 'succeeded';
                state.getAllComments = action.payload;
            })
            .addCase(fetchGetAllComments.rejected, (state, action) => {
                state.getAllCommentsStatus = 'failed';
                state.getAllCommentsError = action.payload;
            })

        // Delete Comment
            .addCase(fetchDeleteComment.pending, (state) => {
                state.deleteCommentStatus = 'loading';
            })
            .addCase(fetchDeleteComment.fulfilled, (state, action) => {
                state.deleteCommentStatus = 'succeeded';
                state.deleteComment = action.payload;
            })
            .addCase(fetchDeleteComment.rejected, (state, action) => {
                state.deleteCommentStatus = 'failed';
                state.deleteCommentError = action.payload;
            })

        // Edit Comment
            .addCase(fetchEditComment.pending, (state) => {
                state.editCommentStatus = 'loading';
            })
            .addCase(fetchEditComment.fulfilled, (state, action) => {
                state.editCommentStatus = 'succeeded';
                state.editComment = action.payload;
            })
            .addCase(fetchEditComment.rejected, (state, action) => {
                state.editCommentStatus = 'failed';
                state.editCommentError = action.payload;
            })
    }
})

export const { resetLike, resetCreateComment, resetDeleteComment, resetEditComment } = PostRelatedSlice.actions
export default PostRelatedSlice.reducer