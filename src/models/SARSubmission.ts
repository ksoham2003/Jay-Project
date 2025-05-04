// models/SARSubmission.ts
import { Document, Model, model, Schema, Types } from 'mongoose';
import { FormData } from '@/types';

// Extend FormData without re-declaring _id
interface SARSubmissionBase extends Omit<FormData, '_id'> {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SARSubmissionDocument extends SARSubmissionBase, Document {
  _id: Types.ObjectId;  // Mongoose uses ObjectId by default
}

const SARSubmissionSchema = new Schema<SARSubmissionDocument>({
  userId: { type: String, required: true },
  teaching: { type: Schema.Types.Mixed },
  feedback: { type: Schema.Types.Mixed },
  admin: { type: Schema.Types.Mixed },
  evaluation: { type: Schema.Types.Mixed },
  isFinal: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'approved', 'rejected'], // Added more statuses
    default: 'draft' 
  },
}, {
  timestamps: true // Better than manually setting createdAt/updatedAt
});

// Add indexes for better query performance
SARSubmissionSchema.index({ userId: 1 });
SARSubmissionSchema.index({ status: 1 });
SARSubmissionSchema.index({ updatedAt: -1 });

export const SARSubmission: Model<SARSubmissionDocument> = 
  model<SARSubmissionDocument>('SARSubmission', SARSubmissionSchema);