import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

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
import ResetPassword from "./Pages/ResetPassword";
import PageNotFound from "./Pages/Error/PageNotFound";
import SupportPage from "./Pages/SupportPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="*" element={<PageNotFound />} />
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:id" element={<OtherProfile />} />
      <Route path="/update-profile" element={<UpdateProfilePage />} />
      <Route path="/text-post" element={<TextPostPage />} />
      <Route path="/edit-post/:id" element={<EditPost />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/video-post" element={<VideoPostPage />} />
      <Route path="/image-post" element={<ImagePostPage />} />
      <Route path="/change-password/:uid/:token" element={<ResetPassword />} />
      <Route path="/support" element={<SupportPage />} />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
