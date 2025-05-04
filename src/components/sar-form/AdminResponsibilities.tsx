'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Trash2 } from 'lucide-react';

interface AdminResponsibilitiesProps {
  onNext: (data: any, isFinal?: boolean) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  initialData?: any;
  saveDraft: () => void;
  isSubmitting: boolean;
}

interface Responsibility {
  id: string;
  level: string;
  name: string;
  files: FileList | null;
}

export function AdminResponsibilities({ 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast,
  initialData,
  saveDraft,
  isSubmitting
}: AdminResponsibilitiesProps) {
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>(
    initialData?.responsibilities || [{
      id: crypto.randomUUID(),
      level: '',
      name: '',
      files: null
    }]
  );
  const [selfAppraisalScore, setSelfAppraisalScore] = useState(
    initialData?.selfAppraisalScore || ''
  );

  const addNewResponsibility = () => {
    setResponsibilities([
      ...responsibilities,
      {
        id: crypto.randomUUID(),
        level: '',
        name: '',
        files: null
      }
    ]);
  };

  const removeResponsibility = (id: string) => {
    if (responsibilities.length > 1) {
      setResponsibilities(responsibilities.filter(item => item.id !== id));
    }
  };

  const updateResponsibility = (id: string, field: keyof Responsibility, value: string | FileList | null) => {
    setResponsibilities(
      responsibilities.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent, isFinal = false) => {
    e.preventDefault();
    const formData = {
      responsibilities,
      selfAppraisalScore
    };
    onNext(formData, isFinal);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">3. Administrative / Executive Responsibilities (20 Marks)</h2>
        
        {responsibilities.map((item, index) => (
          <div key={item.id} className="mb-6 border-b pb-6 last:border-b-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Responsibility {index + 1}</h3>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResponsibility(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Level</Label>
                <Input
                  value={item.level}
                  onChange={(e) => updateResponsibility(item.id, 'level', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
              <div>
                <Label>Name of Responsibility</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateResponsibility(item.id, 'name', e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label>Upload Files</Label>
              <Input
                type="file"
                onChange={(e) => updateResponsibility(item.id, 'files', e.target.files)}
                className="mt-1 w-full"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={addNewResponsibility}
              className="flex items-center"
              type="button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Add New Responsibility
            </Button>
            
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