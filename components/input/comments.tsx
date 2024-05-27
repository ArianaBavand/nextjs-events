import { useContext, useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment, { type Comment } from "./new-comment";
import classes from "./comments.module.css";
import { NotificationContext } from "@/store/notification-context";

interface CommentsProps {
  eventId: string;
}

interface CommentItem {
  _id: string;
  email: string;
  name: string;
  text: string;
  eventId: string;
  date: Date;
}

export default function Comments(props: CommentsProps) {
  const { eventId } = props;

  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isFetchingComment, setIsFetchingComment] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComment(true);
      fetch("/api/comments/" + eventId)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setIsFetchingComment(false);
        });
    }
  }, [showComments, eventId]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  const addCommentHandler = async (commentData: Comment) => {
    notificationCtx.showNotification({
      title: "Submitting...",
      message: "Submitting a new comment",
      status: "pending",
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((data) => {
          throw new Error(data.message || "Something went wrong");
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Your comment has been added successfully!",
          status: "success",
        });
        setComments((prevComments) => [...prevComments, data.comment]);
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      });
  };

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComment && <CommentList items={comments} />}
      {showComments && isFetchingComment && <p>Loading...</p>}
    </section>
  );
}
