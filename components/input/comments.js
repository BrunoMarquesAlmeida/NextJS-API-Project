import { useState, useEffect, useContext } from "react";

import NotificationContext from "../../store/notification-context";
import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";

function Comments(props) {
  const { eventId } = props;
  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetching(true);

      fetch("/api/comments/" + eventId)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setIsFetching(false);
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Creating comment...",
      message: "Creating a new comment for this event",
      status: "pending",
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || "Could not create comment");
        });
      })
      .then(() => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully created a new comment",
          status: "success",
        });
      })
      .catch((err) => {
        notificationCtx.showNotification({
          title: "Oops!",
          message: err.message || "Could not create a new comment",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetching && <CommentList items={comments} />}
      {showComments && isFetching && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
