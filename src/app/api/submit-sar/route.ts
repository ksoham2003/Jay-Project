import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongoose';
import { SARSubmission } from '@/models/SARSubmission';

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req as any);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    // For new submissions
    if (!data._id) {
      const newSubmission = new SARSubmission({
        ...data,
        userId,
        status: 'draft'
      });
      await newSubmission.save();
      return NextResponse.json(newSubmission.toObject());
    }

    // For existing submissions
    const updatedSubmission = await SARSubmission.findOneAndUpdate(
      { _id: data._id, userId },
      { 
        ...data,
        updatedAt: new Date(),
        status: data.isFinal ? 'submitted' : 'draft'
      },
      { new: true }
    ).lean();

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error saving SAR:', error);
    return NextResponse.json(
      { error: 'Failed to save SAR data' },
      { status: 500 }
    );
  }
}