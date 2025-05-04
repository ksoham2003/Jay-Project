import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!userId || !id) {
      return NextResponse.json(
        { error: 'Unauthorized or missing ID' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('sarSubmissions').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Submission not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting SAR:', error);
    return NextResponse.json(
      { error: 'Failed to delete SAR' },
      { status: 500 }
    );
  }
}