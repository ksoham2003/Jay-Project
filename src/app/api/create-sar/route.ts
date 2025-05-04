import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const newSubmission = {
      userId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      teaching: {
        teachingRecords: [{
          id: crypto.randomUUID().toString(),
          semester: '',
          classYear: '',
          subjectName: '',
          lecturesPlanned: '',
          lecturesConducted: '',
          files: null,
          fileUrls: []
        }],
        teachingScore: '',
        pedagogyScore: ''
      },
      feedback: {
        feedbacks: [{
          id: crypto.randomUUID().toString(),
          semester: '',
          subjectName: '',
          feedback: '',
          average: '',
          files: null,
          fileUrls: []
        }],
        selfAppraisalScore: ''
      },
      admin: {
        responsibilities: [{
          id: crypto.randomUUID().toString(),
          level: '',
          name: '',
          files: null,
          fileUrls: []
        }],
        selfAppraisalScore: ''
      },
      evaluation: {
        resultAnalysis: {
          semester: '',
          subjectName: '',
          passingPercentage: '',
          files: null,
          fileUrls: []
        },
        examDuties: [
          { id: 1, name: 'Paper Setting', details: '', score: '', validated: false },
          { id: 2, name: 'Paper Assessment', details: '', score: '', validated: false },
          { id: 3, name: 'Supervision', details: '', score: '', validated: false },
          { id: 4, name: 'Internal Examiner Day', details: '', score: '', validated: false },
          { id: 5, name: 'Flying Squad', details: '', score: '', validated: false },
          { id: 6, name: 'CAP Director', details: '', score: '', validated: false }
        ],
        selfAppraisalScore: ''
      }
    };

    const result = await db.collection('sarSubmissions').insertOne(newSubmission);
    const createdDoc = await db.collection('sarSubmissions').findOne({
      _id: result.insertedId
    });

    if (!createdDoc) {
      throw new Error('Failed to create document');
    }

    return NextResponse.json({
      success: true,
      data: {
        ...createdDoc,
        _id: createdDoc._id.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating new SAR:', error);
    return NextResponse.json(
      { error: 'Failed to create new SAR' },
      { status: 500 }
    );
  }
}