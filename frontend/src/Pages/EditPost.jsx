import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  fetchEditTextPost,
  fetchGetPost,
  resetEditTextPost,
} from "@/features/PostSlice";

function EditPost() {
  const { id, type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const getPost = useSelector((state) => state.post.getPost);
  const getPostStatus = useSelector((state) => state.post.getPostStatus);
  const editTextPostStatus = useSelector(
    (state) => state.post.editTextPostStatus
  );
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

  const [textContent, setTextContent] = useState(getPost.content || "");

  const handleUpdate = () => {
    if (getPost.content === textContent) {
      alert("Nothing to update");
    } else {
      dispatch(
        fetchEditTextPost({
          id: id,
          content: textContent,
        })
      );
    }
  };
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
            {!type === "text" && (
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
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
                  className="resize-none w-full "
                  rows={14}
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
