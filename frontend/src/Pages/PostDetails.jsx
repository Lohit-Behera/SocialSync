import React from "react";
import { useEffect, lazy, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import VideoPlayer from "@/components/VideoPlayer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  fetchGetPost,
  fetchDeletePost,
  resetDeletePost,
} from "@/features/PostSlice";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Pencil, Trash } from "lucide-react";
import { fetchLike, resetLike } from "@/features/PostRelatedSlice";
import { toast } from "react-toastify";
import PostDetailsLoader from "@/components/Loader/PostDetailsLoader";

const Comments = lazy(() => import("@/components/Comments"));
const CustomImage = lazy(() => import("@/components/CustomImage"));
const ServerErrorPage = lazy(() => import("./Error/ServerErrorPage"));

function PostDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails) || {};
  const getPost = useSelector((state) => state.post.getPost) || {};
  const getPostStatus = useSelector((state) => state.post.getPostStatus);
  const postLikeStatus = useSelector(
    (state) => state.postRelated.postLikeStatus
  );
  const deletePostStatus = useSelector((state) => state.post.deletePostStatus);

  useEffect(() => {
    dispatch(fetchGetPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (postLikeStatus === "succeeded") {
      dispatch(fetchGetPost(id));
      dispatch(resetLike());
    } else if (postLikeStatus === "failed") {
      dispatch(resetLike());
    }
  }, [postLikeStatus]);

  useEffect(() => {
    if (deletePostStatus === "succeeded") {
      navigate("/");
      dispatch(resetDeletePost());
    } else if (deletePostStatus === "failed") {
      dispatch(resetDeletePost());
    }
  }, [deletePostStatus]);

  const handleLike = () => {
    if (userInfo) {
      if (!userDetails.is_verified) {
        toast.warning("Please verify your account first");
        navigate("/update-profile");
      } else {
        const likePromise = dispatch(fetchLike(id));
        toast.promise(likePromise, {
          pending: "Pending...",
          success: {
            render({ data }) {
              return `${data.payload.message}`;
            },
          },
          error: "Something went wrong",
        });
      }
    } else {
      toast.warning("Please login first");
      navigate("/login");
    }
  };

  const handleDelete = () => {
    if (userInfo) {
      const deletePromise = dispatch(fetchDeletePost(id)).unwrap();
      toast.promise(deletePromise, {
        pending: "Deleting Post...",
        success: "Post deleted successfully",
        error: "Something went wrong",
      });
    } else {
      toast.warning("Please login first");
      navigate("/login");
    }
  };

  return (
    <Suspense fallback={<PostDetailsLoader />}>
      {getPostStatus === "loading" || getPostStatus === "idle" ? (
        <PostDetailsLoader />
      ) : getPostStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <>
          <h1 className="text-3xl text-center font-bold my-6">Post Details</h1>
          <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
            <Card className="my-10">
              <CardHeader>
                <CardTitle className="flex justify-between ">
                  <div className="flex space-x-2">
                    <Link to={`/profile/${getPost.user}`}>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={getPost.profile_image} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                    </Link>
                    <Link to={`/profile/${getPost.user}`}>
                      <h3 className="text-lg md:text-xl font-semibold mt-2">
                        {getPost.user_name}
                      </h3>
                    </Link>
                  </div>
                  {userInfo?.id === getPost.user && (
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => navigate(`/edit-post/${getPost.id}`)}
                      >
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive">
                            <Trash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your Post and remove your data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(getPost.id)}
                              variant="destructive"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                {getPost.type === "video" && (
                  <VideoPlayer
                    videoSrc={getPost.video}
                    thumbnailSrc={getPost.thumbnail}
                    hoverSet={true}
                  />
                )}
                {getPost.type === "image" && (
                  <div className="max-w-[80vh] mx-auto">
                    <CustomImage
                      src={getPost.image}
                      alt="image"
                      className="w-auto h-full object-cover items-center mb-10"
                    />
                  </div>
                )}
                <p className="text-sm md:text-base">{getPost.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <p className="text-xs text-muted-foreground">
                    Created at: {getPost.created_at.slice(0, 10)}{" "}
                    {getPost.edited && "(edited)"}
                  </p>
                  <div className="flex space-x-4">
                    <div className="flex flex-col">
                      <Heart onClick={handleLike} className="cursor-pointer" />
                      <p className="text-center">{getPost.total_likes}</p>
                    </div>
                    <div className="flex flex-col">
                      <MessageCircle />
                      <p className="text-center">{getPost.total_comments}</p>
                    </div>
                    <div className="flex flex-col">
                      <Send />
                      <p className="text-center">{getPost.total_shares}</p>
                    </div>
                  </div>
                </div>
              </CardFooter>
              <Comments id={id} />
            </Card>
          </div>
        </>
      )}
    </Suspense>
  );
}

export default PostDetails;
