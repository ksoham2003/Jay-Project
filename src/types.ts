import { Types } from "mongoose";

export interface TeachingRecord {
  id: string;
  semester: string;
  classYear: string;
  subjectName: string;
  lecturesPlanned: string;
  lecturesConducted: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface EContentRecord {
  id: string;
  topicName: string;
  link: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface InnovationRecord {
  id: string;
  subjectName: string;
  innovation: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface Feedback {
  id: string;
  semester: string;
  subjectName: string;
  feedback: string;
  average: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface Responsibility {
  id: string;
  level: string;
  name: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface ResultAnalysis {
  semester: string;
  subjectName: string;
  passingPercentage: string;
  files: FileList | null;
  fileUrls?: string[];
}

export interface ExamDuty {
  id: number;
  name: string;
  details: string;
  score: string;
  validated: boolean;
}

export interface FormSection {
  id: keyof FormData;
  component: React.ComponentType<any>;
  title: string;
}

export interface FormData {
  _id?: string | Types.ObjectId | null;
  teaching?: {
    teachingRecords: TeachingRecord[];
    eContentRecords: EContentRecord[];
    innovationRecords: InnovationRecord[];
    teachingScore: string;
    pedagogyScore: string;
  };
  feedback?: {
    feedbacks: Feedback[];
    selfAppraisalScore: string;
  };
  admin?: {
    responsibilities: Responsibility[];
    selfAppraisalScore: string;
  };
  evaluation?: {
    resultAnalysis: ResultAnalysis;
    examDuties: ExamDuty[];
    selfAppraisalScore: string;
  };
  isFinal?: boolean;
  userId?: string;
  updatedAt?: Date;
  status?: 'draft' | 'submitted';
  createdAt?: Date;
}

export interface DBSARSubmission extends FormData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}