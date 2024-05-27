import Head from 'next/head';

import { getFeaturedEvents } from '@/helpers/api-util';
import EventList from '@/components/events/event-list';
import NewsletterRegistration from '@/components/input/newsletter-registration';

export interface HomePageProps {
  events: Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    date: number;
    image: string;
    isFeatured: boolean;
  }>;
}

export default function HomePage(props: HomePageProps) {
  return (
    <div>
      <Head>
        <title>Awesome Events</title>
        <meta
          name="description"
          content="Find a lot of awesome events that allow you to evolve... "
        />
      </Head>
      <NewsletterRegistration />
      <EventList items={props.events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();

  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  };
}
