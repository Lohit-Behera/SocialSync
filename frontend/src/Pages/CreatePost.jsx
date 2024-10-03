import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCreatePost, resetCreatePost } from "@/features/PostSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DragNDrop from "@/components/DragNDrop";
import CustomImage from "@/components/CustomImage";
import { toast } from "sonner";
import { CloudUpload, RefreshCw } from "lucide-react";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails) || {};
  const createPost = useSelector((state) => state.post.createPost);
  const createPostStatus = useSelector((state) => state.post.createPostStatus);

  const [isDragging, setIsDragging] = useState(false);
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else if (!userDetails.is_verified) {
      navigate("/update-profile");
    }
  }, [userInfo]);

  useEffect(() => {
    if (createPostStatus === "succeeded") {
      dispatch(resetCreatePost());
      navigate(`/post/${createPost.id}`);
    } else if (createPostStatus === "failed") {
      dispatch(resetCreatePost());
    }
  }, [createPostStatus, navigate, dispatch]);

  const handleTextPost = () => {
    if (!textContent) {
      toast.warning("Please enter text content");
    } else {
      const textPostPromise = dispatch(
        fetchCreatePost({
          content: textContent,
          type: "text",
        })
      ).unwrap();
      toast.promise(textPostPromise, {
        loading: "Creating post...",
        success: "Post created successfully",
        error: "Something went wrong",
      });
    }
  };

  const handleImagePost = () => {
    if (!image) {
      toast.warning("Please select an image");
    } else if (!textContent) {
      toast.warning("Please enter caption");
    } else {
      const imagePostPromise = dispatch(
        fetchCreatePost({
          content: textContent,
          image: image,
          type: "image",
        })
      ).unwrap();
      toast.promise(imagePostPromise, {
        loading: "Creating post...",
        success: "Post created successfully",
        error: "Something went wrong",
      });
    }
  };

  const handleVideoPost = () => {
    if (!video) {
      toast.warning("Please select a video");
    } else if (!thumbnail) {
      toast.warning("Please select a thumbnail");
    } else if (!textContent) {
      toast.warning("Please enter caption");
    } else {
      const videoPostPromise = dispatch(
        fetchCreatePost({
          content: textContent,
          video: video,
          thumbnail: thumbnail,
          type: "video",
        })
      ).unwrap();
      toast.promise(videoPostPromise, {
        loading: "Creating post...",
        success: "Post created successfully",
        error: "Something went wrong",
      });
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsDragging(false);
    if (file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.warning("Please select an image file");
    }
  };

  const imageHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.warning("Please select an image file");
    }
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsDragging(false);
    if (file.type.startsWith("video/")) {
      setVideo(file);
    } else {
      toast.warning("Please select an video file");
    }
  };

  const videoHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type.startsWith("video/")) {
      setVideo(file);
    } else {
      toast.warning("Please select an video file");
    }
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setIsDragging(false);
    if (file.type.startsWith("image/")) {
      setThumbnail(file);
    } else {
      toast.warning("Please select an image file");
    }
  };

  const thumbnailHandler = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      setThumbnail(file);
    } else {
      toast.warning("Please select an image file");
    }
  };

  const videoElement = useMemo(() => {
    if (video) {
      return (
        <div className="flex justify-center">
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full max-h-[80vh]"
          />
        </div>
      );
    }
    return null;
  }, [video]);
  return (
    <div className="mt-2 w-full">
      <h1 className="text-3xl text-center font-bold">Create Post</h1>
      <div className="flex justify-center mt-6">
        <Card className="w-[90%] md:w-[80%] lg:w-[70%]">
          <Tabs defaultValue="text">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="text">
              <CardContent>
                <h2 className="text-2xl font-bold text-center">Text Post</h2>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="grid gap-2 w-full">
                  <Label htmlFor="message">Create Post</Label>
                  <Textarea
                    id="message"
                    placeholder="Write something..."
                    required
                    onChange={(e) => setTextContent(e.target.value)}
                    className="resize-none w-full "
                    rows={14}
                  />
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  size="sm"
                  onClick={handleTextPost}
                >
                  <CloudUpload className="mr-2 h-4 md:h-5 w-4 md:w-5" /> Post
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="image">
              <CardContent>
                <h2 className="text-2xl font-bold text-center">Image Post</h2>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="grid gap-2 w-full">
                  <Label htmlFor="image-upload">Select Image</Label>
                  {image ? (
                    <>
                      <CustomImage noUrl src={URL.createObjectURL(image)} />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => setImage(null)}
                      >
                        <RefreshCw className="mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                        Change Image
                      </Button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="image"
                        id="image-upload"
                        accept="image/*"
                        label="Upload Image"
                        onChange={(e) => imageHandler(e)}
                        className="block md:hidden w-full text-primary font-semibold file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:hover:cursor-pointer hover:file:bg-primary/90  file:disabled:opacity-50 file:disabled:pointer-events-none cursor-pointer"
                      />
                      <DragNDrop
                        className="hidden md:flex "
                        handleDrop={handleImageDrop}
                        uploadHandler={imageHandler}
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        type={"image"}
                      />
                    </>
                  )}
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="message">Caption</Label>
                  <Textarea
                    id="message"
                    placeholder="Write something..."
                    required
                    onChange={(e) => setTextContent(e.target.value)}
                    className="resize-none w-full "
                    rows={14}
                  />
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  size="sm"
                  onClick={handleImagePost}
                >
                  <CloudUpload className="mr-2 h-4 md:h-5 w-4 md:w-5" /> Post
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="video">
              <CardContent>
                <h2 className="text-2xl font-bold text-center">Video Post</h2>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="grid gap-2 w-full">
                  <Label htmlFor="video-upload">Select Video</Label>
                  {videoElement}
                  {!video ? (
                    <>
                      <input
                        type="file"
                        name="video"
                        id="video-upload"
                        accept="video/*"
                        label="Upload Video"
                        onChange={(e) => videoHandler(e)}
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
                      onClick={(e) => setVideo(null)}
                    >
                      <RefreshCw className="mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                      Change Video
                    </Button>
                  )}
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="image-upload">Select Thumbnail</Label>
                  {thumbnail ? (
                    <>
                      <CustomImage noUrl src={URL.createObjectURL(thumbnail)} />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => setThumbnail(null)}
                      >
                        <RefreshCw className="mr-2 h-4 md:h-5 w-4 md:w-5" />{" "}
                        Change Thumbnail
                      </Button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        name="thumbnail"
                        id="thumbnail-upload"
                        accept="image/*"
                        label="Upload Thumbnail"
                        onChange={(e) => thumbnailHandler(e)}
                        className="block md:hidden w-full text-primary font-semibold file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:hover:cursor-pointer hover:file:bg-primary/90  file:disabled:opacity-50 file:disabled:pointer-events-none cursor-pointer"
                      />
                      <DragNDrop
                        className="hidden md:flex "
                        handleDrop={handleThumbnailDrop}
                        uploadHandler={thumbnailHandler}
                        isDragging={isThumbnailDragging}
                        setIsDragging={setIsThumbnailDragging}
                        type={"image"}
                      />
                    </>
                  )}
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="message">Caption</Label>
                  <Textarea
                    id="message"
                    placeholder="Write something..."
                    required
                    onChange={(e) => setTextContent(e.target.value)}
                    className="resize-none w-full "
                    rows={14}
                  />
                </div>
                <Button
                  variant="default"
                  className="w-full"
                  size="sm"
                  onClick={handleVideoPost}
                >
                  <CloudUpload className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Post
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default CreatePost;
