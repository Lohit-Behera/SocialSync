import { createSlice } from "@reduxjs/toolkit";

const webSocketSlice = createSlice({
    name: 'websocket',
    initialState: {
        webSocketNotificationDisconnected: true,
        webSocketChatDisconnected: true,
    },
    reducers: {
        setWebSocketNotificationDisconnected: (state, action) => {
            state.webSocketNotificationDisconnected = action.payload
        },

        setWebSocketChatDisconnected: (state, action) => {
            state.webSocketChatDisconnected = action.payload
        },
    }
})
export const { setWebSocketNotificationDisconnected, setWebSocketChatDisconnected } = webSocketSlice.actions

export default webSocketSlice.reducer