'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EvaluationAssessmentProps {
  onNext: (data: any, isFinal?: boolean) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  initialData?: any;
  saveDraft: () => void;
  isSubmitting: boolean;
}

interface ResultAnalysis {
  semester: string;
  subjectName: string;
  passingPercentage: string;
  files: FileList | null;
}

interface ExamDuty {
  id: number;
  name: string;
  details: string;
  score: string;
  validated: boolean;
}

export function EvaluationAssessment({ 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast,
  initialData,
  saveDraft,
  isSubmitting
}: EvaluationAssessmentProps) {
  const [resultAnalysis, setResultAnalysis] = useState<ResultAnalysis>(
    initialData?.resultAnalysis || {
      semester: '',
      subjectName: '',
      passingPercentage: '',
      files: null
    }
  );

  const [examDuties, setExamDuties] = useState<ExamDuty[]>(
    initialData?.examDuties || [
      { id: 1, name: 'Paper Setting', details: '', score: '', validated: false },
      { id: 2, name: 'Paper Assessment', details: '', score: '', validated: false },
      { id: 3, name: 'Supervision', details: '', score: '', validated: false },
      { id: 4, name: 'Internal Examiner Day', details: '', score: '', validated: false },
      { id: 5, name: 'Flying Squad', details: '', score: '', validated: false },
      { id: 6, name: 'CAP Director', details: '', score: '', validated: false }
    ]
  );

  const [selfAppraisalScore, setSelfAppraisalScore] = useState(
    initialData?.selfAppraisalScore || ''
  );

  const updateResultAnalysis = (field: keyof ResultAnalysis, value: string | FileList | null) => {
    setResultAnalysis({
      ...resultAnalysis,
      [field]: value
    });
  };

  const updateExamDuty = (id: number, field: keyof ExamDuty, value: string | boolean) => {
    setExamDuties(
      examDuties.map(duty =>
        duty.id === id ? { ...duty, [field]: value } : duty
      )
    );
  };

  const handleSubmit = (e: React.FormEvent, isFinal = false) => {
    e.preventDefault();
    const formData = {
      resultAnalysis,
      examDuties,
      selfAppraisalScore
    };
    onNext(formData, isFinal);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">4. Evaluation and Assessment (20 Marks)</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">4.A Result Analysis (14 Marks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Semester</Label>
              <Input
                value={resultAnalysis.semester}
                onChange={(e) => updateResultAnalysis('semester', e.target.value)}
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <Label>Subject Name</Label>
              <Input
                value={resultAnalysis.subjectName}
                onChange={(e) => updateResultAnalysis('subjectName', e.target.value)}
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <Label>Students Passing %</Label>
              <Input
                value={resultAnalysis.passingPercentage}
                onChange={(e) => updateResultAnalysis('passingPercentage', e.target.value)}
                className="mt-1 w-full"
                required
              />
            </div>
          </div>
          <div>
            <Label>Upload Files</Label>
            <Input
              type="file"
              onChange={(e) => updateResultAnalysis('files', e.target.files)}
              className="mt-1 w-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">4.B Examination Duties (6 Marks; 1 Mark Each)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Sr.No</TableHead>
                <TableHead>Name of Duty</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examDuties.map((duty) => (
                <TableRow key={duty.id}>
                  <TableCell>{duty.id}.</TableCell>
                  <TableCell>{duty.name}</TableCell>
                  <TableCell>
                    <Input 
                      placeholder="Enter Details" 
                      className="w-full" 
                      required
                      value={duty.details}
                      onChange={(e) => updateExamDuty(duty.id, 'details', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="0" 
                      max="1" 
                      className="w-20" 
                      required
                      value={duty.score}
                      onChange={(e) => updateExamDuty(duty.id, 'score', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="checkbox" 
                      className="h-4 w-4" 
                      checked={duty.validated}
                      onChange={(e) => updateExamDuty(duty.id, 'validated', e.target.checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="w-48">
            <Label>Self-Appraisal Score (Out of 20)</Label>
            <Input 
              type="number" 
              min="0" 
              max="20" 
              value={selfAppraisalScore}
              onChange={(e) => setSelfAppraisalScore(e.target.value)}
              className="mt-1" 
              required 
            />
          </div>
          <div className="space-x-2">
            {!isFirst && (
              <Button 
                variant="outline" 
                onClick={onPrevious}
                type="button"
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={saveDraft}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              type="button"
              onClick={(e) => handleSubmit(e, isLast)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : isLast ? 'Submit Final' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}