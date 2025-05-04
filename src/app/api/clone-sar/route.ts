import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db';
import { ObjectId, Filter, WithId, Document } from 'mongodb';
import { DBSARSubmission } from '@/types';

export async function GET(req: Request) {
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

    // Find the original document with proper typing
    const original = await db.collection<DBSARSubmission>('sarSubmissions')
      .findOne({ 
        _id: id,
        userId: userId
      });

    if (!original) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Create clone with proper typing
    const { _id, ...cloneData } = original;
    const newSubmission = {
      ...cloneData,
      userId: userId,
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert and return with proper typing
    const result = await db.collection('sarSubmissions').insertOne(newSubmission);
    const insertedDoc = {
      ...newSubmission,
      _id: result.insertedId
    };

    return NextResponse.json({
      ...insertedDoc,
      _id: insertedDoc._id.toString()
    });
  } catch (error) {
    console.error('Error cloning SAR:', error);
    return NextResponse.json(
      { error: 'Failed to clone SAR' },
      { status: 500 }
    );
  }
}