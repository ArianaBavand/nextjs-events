import classes from "./comment-list.module.css";

interface CommentListProps {
  items: Array<{
    name: string;
    _id: string;
    date: Date;
    text: string;
  }>;
}

export default function CommentList(props: CommentListProps) {
  const { items } = props;

  if (items.length === 0) {
    return <p>There is no comment yet. Be the first!</p>;
  }

  return (
    <ul className={classes.comments}>
      {items.map((item) => (
        <li key={item._id}>
          <p>{item.text}</p>
          <div>
            By <address>{item.name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}
