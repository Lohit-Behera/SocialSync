import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetAllVideoPost,
  resetGetAllVideoPost,
} from "@/features/PostSlice";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PostLoader from "@/components/Loader/PostLoader";

const ServerErrorPage = lazy(() => import("./Error/ServerErrorPage"));
const Posts = lazy(() => import("@/components/Posts"));

function VideoPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [videoPosts, setVideoPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noMorePost, setNoMorePost] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllVideoPost = useSelector((state) => state.post.getAllVideoPost);
  const getAllVideoPostStatus = useSelector(
    (state) => state.post.getAllVideoPostStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  useEffect(() => {
    setVideoPosts([]);
    setNoMorePost(false);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (videoPosts.length === 0) {
      dispatch(fetchGetAllVideoPost());
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
    if (getAllVideoPostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setVideoPosts((prevVideoPosts) => [
        ...prevVideoPosts,
        ...getAllVideoPost.video_posts,
      ]);
      setCurrentPage(getAllVideoPost.current_page);
      setTotalPages(getAllVideoPost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllVideoPost());
      setLoading(false);
    } else if (getAllVideoPostStatus === "failed") {
      alert(getAllVideoPost.massage);
      setPageLoading(false);
      dispatch(resetGetAllVideoPost());
    }
  }, [getAllVideoPostStatus]);

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
        dispatch(fetchGetAllVideoPost(currentPage + 1));
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
    <Suspense fallback={<PostLoader />}>
      {pageLoading ? (
        <PostLoader />
      ) : getAllVideoPostStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoPosts.map((post) => (
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
    </Suspense>
  );
}

export default VideoPostPage;
