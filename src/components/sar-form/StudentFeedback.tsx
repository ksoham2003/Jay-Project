'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Trash2 } from 'lucide-react';

interface StudentFeedbackProps {
  onNext: (data: any, isFinal?: boolean) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  initialData?: any;
  saveDraft: () => void;
  isSubmitting: boolean;
}

interface Feedback {
  id: string;
  semester: string;
  subjectName: string;
  feedback: string;
  average: string;
  files: FileList | null;
}

export function StudentFeedback({ 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast,
  initialData,
  saveDraft,
  isSubmitting
}: StudentFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(
    initialData?.feedbacks || [{
      id: crypto.randomUUID(),
      semester: '',
      subjectName: '',
      feedback: '',
      average: '',
      files: null
    }]
  );
  const [selfAppraisalScore, setSelfAppraisalScore] = useState(
    initialData?.selfAppraisalScore || ''
  );

  const addNewFeedback = () => {
    setFeedbacks([
      ...feedbacks,
      {
        id: crypto.randomUUID(),
        semester: '',
        subjectName: '',
        feedback: '',
        average: '',
        files: null
      }
    ]);
  };

  const removeFeedback = (id: string) => {
    if (feedbacks.length > 1) {
      setFeedbacks(feedbacks.filter(item => item.id !== id));
    }
  };

  const updateFeedback = (id: string, field: keyof Feedback, value: string | FileList | null) => {
    setFeedbacks(
      feedbacks.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent, isFinal = false) => {
    e.preventDefault();
    const formData = {
      feedbacks,
      selfAppraisalScore
    };
    onNext(formData, isFinal);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">2. Feedback from Students (10 Marks)</h2>
        
        {feedbacks.map((feedback, index) => (
          <div key={feedback.id} className="mb-6 border-b pb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Feedback Record {index + 1}</h3>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeedback(feedback.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Semester</Label>
                <Input
                  value={feedback.semester}
                  onChange={(e) => updateFeedback(feedback.id, 'semester', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={feedback.subjectName}
                  onChange={(e) => updateFeedback(feedback.id, 'subjectName', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
              <div>
                <Label>Feedback</Label>
                <Input
                  value={feedback.feedback}
                  onChange={(e) => updateFeedback(feedback.id, 'feedback', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Average Feedback (out of 5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={feedback.average}
                  onChange={(e) => updateFeedback(feedback.id, 'average', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
              <div>
                <Label>Upload Files</Label>
                <Input
                  type="file"
                  onChange={(e) => updateFeedback(feedback.id, 'files', e.target.files)}
                  className="mt-1 w-full"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-4">
          <div className="w-48">
            <Label>Self-Appraisal Score (Out of 10)</Label>
            <Input 
              type="number" 
              min="0" 
              max="10" 
              value={selfAppraisalScore}
              onChange={(e) => setSelfAppraisalScore(e.target.value)}
              className="mt-1" 
              required 
            />
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={addNewFeedback}
              className="flex items-center"
              type="button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Add New Feedback
            </Button>
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