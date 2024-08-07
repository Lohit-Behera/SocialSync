import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetAllImagePost,
  resetGetAllImagePost,
} from "@/features/PostSlice";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2 } from "lucide-react";
import Posts from "@/components/Posts";
import PostLoader from "@/components/Loader/PostLoader";
import ServerErrorPage from "./Error/ServerErrorPage";
import { toast } from "react-toastify";

function ImagePostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [imagePosts, setImagePosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noMorePost, setNoMorePost] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllImagePost = useSelector((state) => state.post.getAllImagePost);
  const getAllImagePostStatus = useSelector(
    (state) => state.post.getAllImagePostStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  useEffect(() => {
    setImagePosts([]);
    setNoMorePost(false);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (imagePosts.length === 0) {
      dispatch(fetchGetAllImagePost());
      dispatch(fetchGetFollow(userInfo.id));
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      setLoadingUser(null);
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      setLoadingUser(null);
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  useEffect(() => {
    if (getAllImagePostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setImagePosts((prevImagePosts) => [
        ...prevImagePosts,
        ...getAllImagePost.image_posts,
      ]);
      setCurrentPage(getAllImagePost.current_page);
      setTotalPages(getAllImagePost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllImagePost());
      setLoading(false);
    } else if (getAllImagePostStatus === "failed") {
      setPageLoading(false);
      setLoading(false);
      dispatch(resetGetAllImagePost());
    }
  }, [getAllImagePostStatus]);

  const handleFollow = (id, status) => {
    setLoadingUser(id);
    const followPromise = dispatch(fetchFollowUser(id)).unwrap();

    toast.promise(followPromise, {
      pending: `${status} user...`,
      success: {
        render({ data }) {
          setLoadingUser(null);
          return `${data.message}`;
        },
      },
      error: {
        render() {
          setLoadingUser(null);
          return "Something went wrong";
        },
      },
    });
  };

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;

    if (Math.ceil(scrolledFromTop) >= scrollableHeight) {
      if (currentPage === totalPages) {
        setNoMorePost(true);
      } else if (currentPage < totalPages) {
        dispatch(fetchGetAllImagePost(currentPage + 1));
        setLoading(true);
        setRunOneTime(true);
      }
    }
  }, [currentPage, totalPages, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {pageLoading ? (
        <PostLoader />
      ) : getAllImagePostStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto mb-6">
          <h1 className="text-3xl font-bold text-center my-4">Image Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePosts.map((post) => (
              <Posts
                key={post.id}
                post={post}
                following={following}
                handleFollow={handleFollow}
                loadingUser={loadingUser}
                followStatus={followStatus}
                userInfo={userInfo}
              />
            ))}
          </div>
          {loading && (
            <Loader2 className="animate-spin mx-auto my-4 w-12 h-12" />
          )}
          {noMorePost && (
            <p className="text-base md:text-lg font-semibold text-center my-6">
              No More Post
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default ImagePostPage;
