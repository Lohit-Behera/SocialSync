import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchChatRoom = createAsyncThunk('chat/room', async (receiver, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(
            `${baseUrl}/api/chat/room/`,
            receiver,
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

export const fetchInitialMessage = createAsyncThunk('initial/message', async (roomName, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `${baseUrl}/api/chat/initial/messages/${roomName}/`,
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

export const fetchAllMassage = createAsyncThunk('all/message', async (names, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `${baseUrl}/api/chat/all/messages/${names.roomName}/${names.keyword}`,
            config
        );
        return data;
    } catch (error) {
        return rejectWithValue(
            error.response && error.response.data.details
                ? error.response.data.details
                : error.details
        );
    }
});

export const fetchUserList = createAsyncThunk('user/list', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `${baseUrl}/api/chat/user/list/`,
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

export const fetchOnlineStatus = createAsyncThunk('user/status', async (_, { rejectWithValue, getState }) => {
    try {
        const { user: { userInfo } = {} } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(
            `${baseUrl}/api/chat/user/online-status/`,
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

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatRoom: null,
        chatRoomStatus: "idle",
        chatRoomError: null,

        initialMessage: null,
        initialMessageStatus: "idle",
        initialMessageError: null,

        allMessage: null,
        allMessageStatus: "idle",
        allMessageError: null,

        userList: null,
        userListStatus: "idle",
        userListError: null,

        onlineStatus: null,
        onlineStatusStatus: "idle",
        onlineStatusError: null,
    },
    reducers: {
        resetInitialMessage: (state) => {
            state.initialMessage = null;
            state.initialMessageStatus = "idle";
            state.initialMessageError = null;
        },
        resetAllMessage: (state) => {
            state.allMessage = null;
            state.allMessageStatus = "idle";
            state.allMessageError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //chat room
            .addCase(fetchChatRoom.pending, (state) => {
                state.chatRoomStatus = "loading";
            })
            .addCase(fetchChatRoom.fulfilled, (state, action) => {
                state.chatRoomStatus = "succeeded";
                state.chatRoom = action.payload;
            })
            .addCase(fetchChatRoom.rejected, (state, action) => {
                state.chatRoomStatus = "failed";
                state.chatRoomError = action.payload;
            })

            //initial message
            .addCase(fetchInitialMessage.pending, (state) => {
                state.initialMessageStatus = "loading";
            })
            .addCase(fetchInitialMessage.fulfilled, (state, action) => {
                state.initialMessageStatus = "succeeded";
                state.initialMessage = action.payload;
            })
            .addCase(fetchInitialMessage.rejected, (state, action) => {
                state.initialMessageStatus = "failed";
                state.initialMessageError = action.payload;
            })

            //all message
            .addCase(fetchAllMassage.pending, (state) => {
                state.allMessageStatus = "loading";
            })
            .addCase(fetchAllMassage.fulfilled, (state, action) => {
                state.allMessageStatus = "succeeded";
                state.allMessage = action.payload;
            })
            .addCase(fetchAllMassage.rejected, (state, action) => {
                state.allMessageStatus = "failed";
                state.allMessageError = action.payload;
            })

            //user list
            .addCase(fetchUserList.pending, (state) => {
                state.userListStatus = "loading";
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.userListStatus = "succeeded";
                state.userList = action.payload;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.userListStatus = "failed";
                state.userListError = action.payload;
            })

            //online status
            .addCase(fetchOnlineStatus.pending, (state) => {
                state.onlineStatusStatus = "loading";
            })
            .addCase(fetchOnlineStatus.fulfilled, (state, action) => {
                state.onlineStatusStatus = "succeeded";
                state.onlineStatus = action.payload;
            })
            .addCase(fetchOnlineStatus.rejected, (state, action) => {
                state.onlineStatusStatus = "failed";
                state.onlineStatusError = action.payload;
            })
    },
});

export const { resetInitialMessage, resetAllMessage } = chatSlice.actions;

export default chatSlice.reducer;