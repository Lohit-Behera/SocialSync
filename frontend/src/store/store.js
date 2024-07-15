import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import PostSlice from "@/features/PostSlice";
import PostRelatedSlice from "@/features/PostRelatedSlice";
import UserFollowSlice from "@/features/UserFollowSlice";
import ChatSlice from "@/features/ChatSlice";


import DeleteImages from "@/features/DeleteImages";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
        user: UserSlice,
        post: PostSlice,
        postRelated: PostRelatedSlice,
        userFollow: UserFollowSlice,
        chat: ChatSlice,
        
        deleteImages: DeleteImages
    }
})

export default store