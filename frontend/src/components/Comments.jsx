import React from "react";
import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
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
import { MessageSquarePlus, Pencil, Trash, X } from "lucide-react";
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
import { toast } from "react-toastify";

import CommentLoader from "./Loader/CommentLoader";

const ServerErrorPage = lazy(() => import("../Pages/Error/ServerErrorPage"));

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
    } else if (createCommentStatus === "failed") {
    } else if (editCommentStatus === "succeeded") {
      dispatch(resetEditComment());
      dispatch(fetchGetAllComments(id));
    } else if (editCommentStatus === "failed") {
      dispatch(resetEditComment());
    }
  }, [createCommentStatus, editCommentStatus]);

  useEffect(() => {
    if (deleteCommentStatus === "succeeded") {
      dispatch(fetchGetAllComments(id));
      dispatch(resetDeleteComment());
    } else if (deleteCommentStatus === "failed") {
      dispatch(resetDeleteComment());
    }
  }, [deleteCommentStatus]);

  const [comment, setComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editComment, setEditComment] = useState("");

  const handleComment = () => {
    if (!comment) {
      toast.warning("Please write a comment");
    } else {
      const commentPromise = dispatch(
        fetchCreateComment({
          id: id,
          content: comment,
        })
      ).unwrap();
      toast.promise(commentPromise, {
        pending: "Creating comment...",
        success: "Comment created successfully",
        error: "Something went wrong",
      });
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
      toast.warning("Please enter a comment");
    } else {
      const commentEditPromise = dispatch(
        fetchEditComment({
          id: commentId,
          content: editComment,
        })
      ).unwrap();
      toast.promise(commentEditPromise, {
        pending: "Updating comment...",
        success: "Comment updated successfully",
        error: "Something went wrong",
      });
      setIsEdit(!isEdit);
    }
  };

  const handleCommentDelete = (commentId) => {
    const commentDeletePromise = dispatch(
      fetchDeleteComment(commentId)
    ).unwrap();
    toast.promise(commentDeletePromise, {
      pending: "Deleting comment...",
      success: "Comment deleted successfully",
      error: "Something went wrong",
    });
  };

  return (
    <Suspense fallback={<CommentLoader />}>
      {userInfo && (
        <CardFooter className="w-full flex flex-col space-y-3">
          <div className="grid grid-cols-1 gap-4 w-full">
            <Label htmlFor="comment" className="text-muted-foreground">
              Add a Comment
            </Label>
            <Textarea
              id="comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full resize-none"
              rows={5}
            />
          </div>
          <Button className="w-full" size="sm" onClick={handleComment}>
            <MessageSquarePlus className="mr-2 h-4 md:h-5 w-4 md:w-5" />
            Add
          </Button>
        </CardFooter>
      )}
      {getAllCommentsStatus === "loading" || getAllCommentsStatus === "idle" ? (
        <CommentLoader />
      ) : getAllCommentsStatus === "failed" ? (
        <ServerErrorPage />
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
                          className="w-8 h-8 hover:bg-background/40"
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
                                permanently delete your Comment and remove data
                                from our servers.
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
    </Suspense>
  );
}

export default Comments;
