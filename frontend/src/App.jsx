import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Layout from "./Layout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import CreatePost from "./Pages/CreatePost";
import PostDetails from "./Pages/PostDetails";
import OtherProfile from "./Pages/OtherProfilePage";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import ProfilePage from "./Pages/ProfilePage";
import TextPostPage from "./Pages/TextPostPage";
import EditPost from "./Pages/EditPost";
import InboxPage from "./Pages/InboxPage";
import ChatPage from "./Pages/ChatPage";
import VideoPostPage from "./Pages/VideoPostPage";
import ImagePostPage from "./Pages/ImagePostPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:id" element={<OtherProfile />} />
      <Route path="/update-profile" element={<UpdateProfilePage />} />
      <Route path="/text-post" element={<TextPostPage />} />
      <Route path="/edit-post/:id/:type" element={<EditPost />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/video-post" element={<VideoPostPage />} />
      <Route path="/image-post" element={<ImagePostPage />} />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
