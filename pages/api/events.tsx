import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const fireBaseUrl = process.env.DATABASEFIREBASE_URL as string;

  try {
    const response = await fetch(fireBaseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Firebase');
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(
      'Error fetching data from Firebase:',
      (error as Error).message,
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
