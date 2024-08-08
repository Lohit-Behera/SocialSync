import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { fetchGetUserAllPost, resetGetUserAllPost } from "@/features/PostSlice";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import ProfileLoader from "./Loader/ProfileLoader";

const Posts = lazy(() => import("@/components/Posts"));
const ServerErrorPage = lazy(() => import("@/Pages/Error/ServerErrorPage"));

function Profile({ user = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    id,
    profile_image,
    user_name,
    first_name,
    last_name,
    followers = [],
    following = [],
    total_posts,
  } = user;

  const userInfo = useSelector((state) => state.user.userInfo);
  const userFollowing =
    useSelector((state) => state.userFollow.getFollow.following) || [];
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const getUserAllPostStatus = useSelector(
    (state) => state.post.getUserAllPostStatus
  );
  const getUserAllPost =
    useSelector((state) => state.post.getUserAllPost) || [];

  const [posts, setPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [noMorePost, setNoMorePost] = useState(false);

  useEffect(() => {
    setPosts([]);
    setNoMorePost(false);
    if (!userInfo) {
      navigate(`/login`);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchGetUserAllPost({ id: id }));
  }, [dispatch]);

  useEffect(() => {
    if (getUserAllPostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setPosts((prevPosts) => [...prevPosts, ...getUserAllPost.posts]);
      setCurrentPage(getUserAllPost.current_page);
      setTotalPages(getUserAllPost.total_pages);
      setPageLoading(false);
      dispatch(resetGetUserAllPost());
      setLoading(false);
    } else if (getUserAllPostStatus === "failed") {
      setPageLoading(false);
      setLoading(false);
      dispatch(resetGetUserAllPost());
    }
  }, [getUserAllPostStatus]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;

    if (Math.ceil(scrolledFromTop) >= scrollableHeight) {
      if (currentPage === totalPages) {
        setNoMorePost(true);
      } else if (currentPage < totalPages) {
        dispatch(fetchGetUserAllPost({ id: id, page: currentPage + 1 }));
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

  const handleFollow = (id, status) => {
    const followPromise = dispatch(fetchFollowUser(id)).unwrap();
    toast.promise(followPromise, {
      pending: `${status} user...`,
      success: {
        render({ data }) {
          return `${data.message}`;
        },
      },
      error: "Something went wrong",
    });
  };

  return (
    <Suspense fallback={<ProfileLoader />}>
      <div className="w-[96%] md:w-[80%] lg:w-[70%] mx-auto mt-4">
        {pageLoading ? (
          <ProfileLoader />
        ) : getUserAllPostStatus === "failed" ? (
          <ServerErrorPage />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div className="flex space-x-2">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile_image} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <h3 className="text-base md:text-lg font-semibold mt-4">
                    {user_name}
                  </h3>
                </div>
                {id === userInfo.id ? null : (
                  <Button
                    className="text-xs md:text-sm mt-2.5"
                    size="sm"
                    variant={
                      userFollowing.includes(id) ? "secondary" : "default"
                    }
                    onClick={() =>
                      handleFollow(
                        id,
                        userFollowing.includes(id) ? "Unfollowing" : "Following"
                      )
                    }
                  >
                    {userFollowing.includes(id) ? (
                      "Unfollow"
                    ) : followStatus === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        loading
                      </>
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {first_name} {last_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3">
                <div>
                  <p className="text-base md:text-xl font-semibold mt-2 text-center">
                    Followers
                  </p>
                  <p className="text-center">{followers.length}</p>
                </div>
                <div>
                  <p className="text-base md:text-xl font-semibold mt-2 text-center">
                    Following
                  </p>
                  <p className="text-center">{following.length}</p>
                </div>
                <div>
                  <p className="text-base md:text-xl font-semibold mt-2 text-center">
                    Post
                  </p>
                  <p className="text-center">{total_posts}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              {posts.length > 0 ? (
                <>
                  <p className="text-lg md:text-xl font-semibold text-center my-4">
                    Posts
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                      <Posts key={post.id} post={post} bgColor="bg-muted" />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-base md:text-lg font-semibold text-center my-6">
                  User Has No Post.
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
            </CardFooter>
          </Card>
        )}
      </div>
    </Suspense>
  );
}

export default Profile;
