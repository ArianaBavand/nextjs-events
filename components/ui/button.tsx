import Link from 'next/link';
import classes from './button.module.css';
interface ButtonProps {
  link?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: ButtonProps) {
  if (props.link) {
    return (
      <Link href={props.link}>
        <span className={classes.btn}>{props.children}</span>
      </Link>
    );
  }

  return (
    <button className={classes.btn} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
