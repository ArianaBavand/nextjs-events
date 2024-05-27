import classes from './event-list.module.css';
import EventItem from './event-item';

export default function EventList(props: { items: any }) {
  const { items } = props;

  return (
    <ul className={classes.list}>
      {items.map(
        (event: {
          id: string;
          title: string;
          location: string;
          date: number;
          image: string;
        }) => (
          <EventItem
            key={event.id}
            id={event.id}
            title={event.title}
            location={event.location}
            date={event.date}
            image={event.image}
          />
        ),
      )}
    </ul>
  );
}
