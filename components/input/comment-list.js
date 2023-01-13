import classes from "./comment-list.module.css";

function CommentList({ items }) {
  return (
    <ul className={classes.comments}>
      {items.map(({ text, name, _id }) => {
        return (
          <li key={_id}>
            <p>{text}</p>
            <div>
              By <address>{name}</address>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;
