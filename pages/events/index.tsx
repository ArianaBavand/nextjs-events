import Head from 'next/head';
import EventList from '@/components/events/event-list';
import EventSearch from '@/components/events/events-search';
import { getAllEvents } from '@/helpers/api-util';
import { useRouter } from 'next/router';
import { HomePageProps } from '@/pages/index';

interface AllEventPageProps {
  events: HomePageProps;
}

export default function AllEventsPage(props: AllEventPageProps) {
  const router = useRouter();
  const { events } = props;

  function findEventsHandler(year: string, month: string) {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  return (
    <>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="You can browse all of the events here... "
        />
      </Head>
      <EventSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </>
  );
}

export async function getStaticProps() {
  const events = await getAllEvents();

  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}
