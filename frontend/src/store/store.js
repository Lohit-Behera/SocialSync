import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import PostSlice from "@/features/PostSlice";
import PostRelatedSlice from "@/features/PostRelatedSlice";
import UserFollowSlice from "@/features/UserFollowSlice";
import ChatSlice from "@/features/ChatSlice";
import webSocketSlice from "@/features/WebSocketSlice";
import SupportSlice from "@/features/SupportSlice";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
        webSocket: webSocketSlice,
        user: UserSlice,
        post: PostSlice,
        postRelated: PostRelatedSlice,
        userFollow: UserFollowSlice,
        chat: ChatSlice,
        support: SupportSlice
    }
})

export default store