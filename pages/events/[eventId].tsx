import Head from 'next/head';
import EventContent from '@/components/event-detail/event-content';
import EventLogistics from '@/components/event-detail/event-logistics';
import EventSummary from '@/components/event-detail/event-summary';
import { getEventById, getFeaturedEvents } from '@/helpers/api-util';
import Comments from '@/components/input/comments';

import { GetServerSidePropsContext } from 'next';

type EventIdProps = {
  selectedEvent: {
    id: string;
    title: string;
    date: Date;
    location: string;
    image: string;
    description: string;
  };
};

export default function EventDetail(props: EventIdProps) {
  const event = props.selectedEvent;

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={new Date(event.date)}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={event.id} />
    </>
  );
}

export async function getStaticProps(context: GetServerSidePropsContext) {
  const eventId = context.params?.eventId;

  if (!eventId || typeof eventId !== 'string') {
    return {
      notFound: true,
    };
  }

  const event = await getEventById(eventId);

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      selectedEvent: event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents();
  const path = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: path,
    fallback: true,
  };
}
