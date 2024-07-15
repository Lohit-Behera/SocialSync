import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CardFooter } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Pencil, Trash, X } from "lucide-react";
import {
  fetchCreateComment,
  fetchDeleteComment,
  fetchEditComment,
  fetchGetAllComments,
  resetCreateComment,
  resetDeleteComment,
  resetEditComment,
} from "@/features/PostRelatedSlice";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Comments({ id }) {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const createCommentStatus = useSelector(
    (state) => state.postRelated.createCommentStatus
  );
  const getAllComments = useSelector(
    (state) => state.postRelated.getAllComments
  );
  const getAllCommentsStatus = useSelector(
    (state) => state.postRelated.getAllCommentsStatus
  );
  const editCommentStatus = useSelector(
    (state) => state.postRelated.editCommentStatus
  );
  const deleteCommentStatus = useSelector(
    (state) => state.postRelated.deleteCommentStatus
  );

  useEffect(() => {
    dispatch(fetchGetAllComments(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (createCommentStatus === "succeeded") {
      dispatch(resetCreateComment());
      dispatch(fetchGetAllComments(id));
      alert("Comment created successfully");
    } else if (createCommentStatus === "failed") {
      alert("Something went wrong");
    } else if (editCommentStatus === "succeeded") {
      dispatch(resetEditComment());
      dispatch(fetchGetAllComments(id));
      alert("Comment updated successfully");
    } else if (editCommentStatus === "failed") {
      dispatch(resetEditComment());
      alert("Something went wrong");
    }
  }, [createCommentStatus, editCommentStatus]);

  useEffect(() => {
    if (deleteCommentStatus === "succeeded") {
      dispatch(fetchGetAllComments(id));
      dispatch(resetDeleteComment());
      alert("Comment deleted successfully");
    } else if (deleteCommentStatus === "failed") {
      dispatch(resetDeleteComment());
      alert("Something went wrong");
    }
  }, [deleteCommentStatus]);

  const [comment, setComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editComment, setEditComment] = useState("");

  const handleComment = () => {
    if (!comment) {
      alert("Please enter a comment");
    } else {
      console.log(comment);
      dispatch(
        fetchCreateComment({
          id: id,
          content: comment,
        })
      );
      setComment("");
    }
  };

  const handleEditButton = (userComment) => {
    setIsEdit(!isEdit);
    setEditId(userComment.id);
    setEditComment(userComment.content);
  };

  const handleCommentEdit = (commentId) => {
    if (!editComment) {
      alert("Please enter a comment");
    } else {
      dispatch(
        fetchEditComment({
          id: commentId,
          content: editComment,
        })
      );
      setIsEdit(!isEdit);
    }
  };

  const handleCommentDelete = (commentId) => {
    dispatch(fetchDeleteComment(commentId));
  };

  return (
    <>
      {userInfo && (
        <CardFooter className="w-full flex flex-col space-y-3">
          <div className="grid grid-cols-1 gap-4 w-full">
            <Label htmlFor="comment" className="text-muted-foreground">
              Add a Comment
            </Label>
            <Textarea
              id="comment"
              required
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full resize-none"
              rows={5}
            />
          </div>
          <Button className="w-full" size="sm" onClick={handleComment}>
            Add
          </Button>
        </CardFooter>
      )}
      {getAllCommentsStatus === "loading" || getAllCommentsStatus === "idle" ? (
        <p>Loading...</p>
      ) : getAllCommentsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          {getAllComments.length > 0 ? (
            <CardFooter className="w-full flex flex-col space-y-3">
              <h1 className="text-lg font-semibold">Comments</h1>
              {getAllComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex flex-col space-y-3  bg-muted w-full rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Link to={`/profile/${comment.user}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.profile_image} />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                      </Link>
                      <Link to={`/profile/${comment.user}`}>
                        <h3 className="text-sm md:text-base font-semibold mt-1">
                          {comment.user_name}
                        </h3>
                      </Link>
                    </div>
                    {userInfo?.id === comment.user && (
                      <div className="flex space-x-2">
                        <Button
                          className="w-8 h-8"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleEditButton({
                              id: comment.id,
                              content: comment.content,
                            })
                          }
                        >
                          {isEdit ? (
                            <X className="w-6 h-6" />
                          ) : (
                            <Pencil className="w-6 h-6" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="w-8 h-8"
                              size="icon"
                              variant="destructive"
                            >
                              <Trash className="w-6 h-6" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your Post and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleCommentDelete(comment.id)}
                                variant="destructive"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  {isEdit && comment.id === editId ? (
                    <div className="flex flex-col space-y-2">
                      <Textarea
                        id="comment-edit"
                        required
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full resize-none"
                        rows={5}
                      />
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleCommentEdit(comment.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <p>{comment.content}</p>
                  )}
                </div>
              ))}
            </CardFooter>
          ) : (
            <p className="text-center text-lg font-semibold mb-4">
              No comments yet
            </p>
          )}
        </>
      )}
    </>
  );
}

export default Comments;
