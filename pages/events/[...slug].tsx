import Head from 'next/head';
import EventList from '@/components/events/event-list';
import { useRouter } from 'next/router';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

interface EventsType {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  image: string;
  isFeatured: boolean;
}

export default function FilteredEventsPage() {
  const [loadedEvents, setLoadedEvents] = useState<EventsType[]>();
  const router = useRouter();

  const filterData = router.query.slug || [];

  const { data, error } = useSWR('/api/events', (url) =>
    fetch(url).then((res) => res.json()),
  );

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }
      setLoadedEvents(events);
    }
  }, [data]);

  const numYear = +filterData?.[0];
  const numMonth = +filterData?.[1];

  const pageHeadData = (
    <Head>
      <title>Filtered by date</title>
      <meta
        name="description"
        content={`All events for ${numMonth} of ${numYear}`}
      />
    </Head>
  );

  if (!loadedEvents) {
    return (
      <>
        {pageHeadData}
        <p className="center">Loading...</p>;
      </>
    );
  }

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth > 12 ||
    numMonth < 1 ||
    error
  ) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const filteredEvents = loadedEvents.filter((event: EventsType) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </>
  );
}
