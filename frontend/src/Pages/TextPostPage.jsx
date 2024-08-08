import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetAllTextPost, resetGetAllTextPost } from "@/features/PostSlice";
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

function TextPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [textPosts, setTextPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noMorePost, setNoMorePost] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllTextPost = useSelector((state) => state.post.getAllTextPost);
  const getAllTextPostStatus = useSelector(
    (state) => state.post.getAllTextPostStatus
  );
  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following = useSelector(
    (state) => state.userFollow.getFollow.following
  );

  useEffect(() => {
    setTextPosts([]);
    setNoMorePost(false);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (textPosts.length === 0) {
      dispatch(fetchGetAllTextPost());
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
    if (getAllTextPostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setTextPosts((prevTextPosts) => [
        ...prevTextPosts,
        ...getAllTextPost.text_posts,
      ]);
      setCurrentPage(getAllTextPost.current_page);
      setTotalPages(getAllTextPost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllTextPost());
      setLoading(false);
    } else if (getAllTextPostStatus === "failed") {
      alert(getAllTextPost.massage);
      setPageLoading(false);
      dispatch(resetGetAllTextPost());
    }
  }, [getAllTextPostStatus]);

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
        dispatch(fetchGetAllTextPost(currentPage + 1));
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
      ) : getAllTextPostStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <>
          <h1 className="text-3xl text-center font-bold my-4">Text Post</h1>
          <div className="w-[96%] md:w-[90%] lg:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {textPosts.length > 0 ? (
              <>
                {textPosts.map((post) => (
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
              </>
            ) : (
              <p className="text-lg font-semibold">No Text Post</p>
            )}
            {loading && (
              <Loader2 className="animate-spin mx-auto my-4 w-12 h-12" />
            )}
          </div>
          {noMorePost && (
            <p className="text-base md:text-lg font-semibold text-center my-6">
              No More Post
            </p>
          )}
        </>
      )}
    </>
  );
}

export default TextPostPage;
