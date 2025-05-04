import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    let data;
    if (id) {
      data = await db.collection('sarSubmissions').findOne({ 
        _id: new ObjectId(id),
        userId 
      });
    } else if (all) {
      data = await db.collection('sarSubmissions')
        .find({ userId })
        .sort({ updatedAt: -1 })
        .toArray();
    } else {
      data = await db.collection('sarSubmissions')
        .find({ userId })
        .sort({ updatedAt: -1 })
        .limit(1)
        .next();
    }

    if (!data && id) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB data to plain objects
    const processData = (doc: any) => {
      if (!doc) return doc;
      const result = { ...doc };
      if (result._id) result._id = result._id.toString();
      if (result.createdAt) result.createdAt = result.createdAt.toISOString();
      if (result.updatedAt) result.updatedAt = result.updatedAt.toISOString();
      return result;
    };

    const processedData = Array.isArray(data)
      ? data.map(processData)
      : processData(data);

    return NextResponse.json(processedData || {});
  } catch (error) {
    console.error('Error fetching SAR data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SAR data' },
      { status: 500 }
    );
  }
}