import React from "react";
import { useEffect, useMemo } from "react";
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
import Comments from "@/components/Comments";

function PostDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const getPost = useSelector((state) => state.post.getPost) || {};
  const getPostStatus = useSelector((state) => state.post.getPostStatus);
  const postLike = useSelector((state) => state.postRelated.postLike);
  const postLikeStatus = useSelector(
    (state) => state.postRelated.postLikeStatus
  );
  const deletePostStatus = useSelector((state) => state.post.deletePostStatus);

  useEffect(() => {
    dispatch(fetchGetPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (postLike.message === "Post liked") {
      dispatch(fetchGetPost(id));
      dispatch(resetLike());
      alert("post liked successfully");
    } else if (postLike.message === "Post unliked") {
      dispatch(fetchGetPost(id));
      dispatch(resetLike());
      alert("post unliked successfully");
    } else if (postLikeStatus === "failed") {
      dispatch(resetLike());
      alert("Something went wrong");
    }
  }, [postLikeStatus]);

  useEffect(() => {
    if (deletePostStatus === "succeeded") {
      navigate("/profile");
      dispatch(resetDeletePost());
      alert("Post deleted successfully");
    } else if (deletePostStatus === "failed") {
      dispatch(resetDeletePost());
      alert("Something went wrong");
    }
  }, [deletePostStatus]);

  const handleLike = () => {
    if (userInfo) {
      dispatch(fetchLike(id));
    } else {
      navigate("/login");
    }
  };

  const handleDelete = () => {
    if (userInfo) {
      dispatch(fetchDeletePost(id));
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {getPostStatus === "loading" || getPostStatus === "idle" ? (
        <p>Loading...</p>
      ) : getPostStatus === "failed" ? (
        <p>Error</p>
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
                        onClick={() =>
                          navigate(`/edit-post/${getPost.id}/text`)
                        }
                      >
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="outline">
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
                  <VideoPlayer videoSrc={getPost.video} />
                )}
                {getPost.type === "image" && (
                  <div className="max-w-[80vh] mx-auto">
                    <img
                      src={getPost.image}
                      alt="image"
                      className="w-auto h-full object-cover items-center "
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
    </>
  );
}

export default PostDetails;
