import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  fetchEditPost,
  fetchGetPost,
  resetEditTextPost,
} from "@/features/PostSlice";
import VideoPlayer from "@/components/VideoPlayer";
import DragNDrop from "@/components/DragNDrop";

function EditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getPost = useSelector((state) => state.post.getPost);
  const type = getPost.type || "";
  const getPostStatus = useSelector((state) => state.post.getPostStatus);
  const editTextPostStatus = useSelector(
    (state) => state.post.editTextPostStatus
  );

  const [textContent, setTextContent] = useState(getPost.content || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchGetPost(id));
    }
  }, [userInfo, navigate, dispatch, id]);

  useEffect(() => {
    if (editTextPostStatus === "succeeded") {
      alert("Post updated successfully");
      navigate(`/post/${id}`);
      dispatch(resetEditTextPost());
    } else if (editTextPostStatus === "failed") {
      alert("Something went wrong");
    }
  }, [editTextPostStatus, navigate]);

  const handleUpdate = () => {
    if (getPost.content === textContent) {
      console.log("run1");
      alert("Nothing to update");
    } else if (getPost.type === "image") {
      console.log("run2");
      if (image === null) {
        console.log("run3");
        alert("Please select an image");
      } else {
        dispatch(
          fetchEditPost({
            id: id,
            type: type,
            image: image,
            content: textContent,
          })
        );
      }
    } else if (getPost.type === "video") {
      console.log("run4");
      if (video === null) {
        alert("Please select a video");
      } else {
        dispatch(
          fetchEditPost({
            id: id,
            type: type,
            video: video,
            content: textContent,
          })
        );
      }
    } else {
      dispatch(
        fetchEditPost({
          id: id,
          type: type,
          content: textContent,
        })
      );
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsDragging(false);
    if (file.type.startsWith("image/")) {
      console.log(file);
      setImage(file);
    } else {
      alert("Please select an image file");
    }
  };

  const imageHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      console.log(file);
      setImage(file);
    } else {
      alert("Please select an image file");
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsDragging(false);
    if (file.type.startsWith("video/")) {
      console.log(file);
      setVideo(file);
    } else {
      alert("Please select an video file");
    }
  };

  const videoHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type.startsWith("video/")) {
      console.log(file);
      setVideo(file);
    } else {
      alert("Please select an video file");
    }
  };

  const videoElement = useMemo(() => {
    if (video) {
      return (
        <video src={URL.createObjectURL(video)} controls className="w-full" />
      );
    }
    return null;
  }, [video]);

  const imageElement = useMemo(() => {
    if (image) {
      return (
        <img
          src={URL.createObjectURL(image)}
          alt="uploaded"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    }
    return null;
  }, [image]);

  return (
    <div className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto">
      {getPostStatus === "loading" || getPostStatus === "idle" ? (
        <p>Loading...</p>
      ) : getPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center p-2 my-4">Edit Post</h1>
          <Card>
            {(getPost.type === "image" || getPost.type === "video") && (
              <CardHeader>
                <CardTitle>
                  {getPost.type === "video" && (
                    <VideoPlayer
                      videoSrc={getPost.video}
                      hight="h-auto md:h-60 rounded-lg"
                      videoId={getPost.id}
                      isActive={activeVideoId === getPost.id}
                      setActiveVideoId={setActiveVideoId}
                    />
                  )}
                  {getPost.type === "image" && (
                    <img
                      src={getPost.image}
                      alt="image"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </CardTitle>
                {getPost.type === "image" && (
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="image-upload">Edit Post</Label>
                    {imageElement}
                    {!image ? (
                      <>
                        <input
                          type="file"
                          name="image"
                          id="image-upload"
                          accept="image/*"
                          label="Upload Image"
                          onChange={imageHandler}
                          className="block md:hidden w-full text-primary font-semibold file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:hover:cursor-pointer hover:file:bg-primary/90  file:disabled:opacity-50 file:disabled:pointer-events-none cursor-pointer"
                        />
                        <DragNDrop
                          className="hidden md:flex"
                          handleDrop={handleImageDrop}
                          uploadHandler={imageHandler}
                          isDragging={isDragging}
                          setIsDragging={setIsDragging}
                          type={"image"}
                        />
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setImage(null)}
                      >
                        New Image
                      </Button>
                    )}
                  </div>
                )}
                {getPost.type === "video" && (
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="video-upload">Edit Post</Label>
                    {videoElement}
                    {!video ? (
                      <>
                        <input
                          type="file"
                          name="video"
                          id="video-upload"
                          accept="video/*"
                          label="Upload Video"
                          onChange={videoHandler}
                          className="block md:hidden w-full text-primary font-semibold file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:hover:cursor-pointer hover:file:bg-primary/90  file:disabled:opacity-50 file:disabled:pointer-events-none cursor-pointer"
                        />
                        <DragNDrop
                          className="hidden md:flex"
                          handleDrop={handleVideoDrop}
                          uploadHandler={videoHandler}
                          isDragging={isDragging}
                          setIsDragging={setIsDragging}
                          type={"video"}
                        />
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setVideo(null)}
                      >
                        New Video
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
            )}
            <CardContent className="w-full">
              <div className="grid gap-2 w-full">
                <Label htmlFor="message">Update Post</Label>
                <Textarea
                  id="message"
                  placeholder="Write something..."
                  required
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="resize-none w-full"
                  rows={8}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="w-full"
                size="sm"
                onClick={handleUpdate}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

export default EditPost;
