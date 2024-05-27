import { NextApiRequest, NextApiResponse } from 'next';

import { connectDataBase, insertDocument } from '@/helpers/db-util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@') || userEmail.length === 0) {
      res.status(422).json({ message: 'Invalid email address' });
      return;
    }

    let client;

    try {
      client = await connectDataBase();
    } catch (error) {
      res.status(500).json({ message: 'Connecting to the database failed!' });
      return;
    }

    try {
      await insertDocument(client, 'newsletter', { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Inserting data failed!' });
      return;
    }

    res.status(201).json({ message: 'Signed up!' });
  }
}
