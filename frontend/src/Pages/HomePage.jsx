import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetAllFollowingPosts,
  resetGetAllFollowingPosts,
} from "@/features/PostSlice";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2 } from "lucide-react";
import Posts from "@/components/Posts";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noMorePost, setNoMorePost] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllFollowingPosts = useSelector(
    (state) => state.post.getAllFollowingPosts
  );
  const getAllFollowingPostsStatus = useSelector(
    (state) => state.post.getAllFollowingPostsStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  useEffect(() => {
    setPosts([]);
    setNoMorePost(false);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (posts.length === 0) {
      dispatch(fetchGetAllFollowingPosts());
      dispatch(fetchGetFollow(userInfo.id));
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      alert(follow.message);
      setLoadingUser(null);
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      alert(follow.message);
      setLoadingUser(null);
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  useEffect(() => {
    if (getAllFollowingPostsStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setPosts((prevPosts) => [
        ...prevPosts,
        ...getAllFollowingPosts.following_posts,
      ]);
      setCurrentPage(getAllFollowingPosts.current_page);
      setTotalPages(getAllFollowingPosts.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllFollowingPosts());
      setLoading(false);
    } else if (getAllFollowingPostsStatus === "failed") {
      setPageLoading(false);
      setLoading(false);
      dispatch(resetGetAllFollowingPosts());
    }
  }, [getAllFollowingPostsStatus]);

  const handleFollow = (id) => {
    setLoadingUser(id);
    dispatch(fetchFollowUser(id));
  };

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;

    if (Math.ceil(scrolledFromTop) >= scrollableHeight) {
      console.log("User has scrolled to the bottom", currentPage);
      if (currentPage === totalPages) {
        setNoMorePost(true);
      } else if (currentPage < totalPages) {
        dispatch(fetchGetAllFollowingPosts(currentPage + 1));
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
        <p>Loading...</p>
      ) : getAllFollowingPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto mb-6">
          <h1 className="text-3xl font-bold text-center my-4">Image Posts</h1>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
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
          ) : (
            <p className="text-base md:text-lg font-semibold text-center my-6">
              You Have not follow any user.
            </p>
          )}
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

export default HomePage;
