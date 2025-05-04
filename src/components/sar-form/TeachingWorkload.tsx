'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeachingWorkloadProps {
  onNext: (data: any, isFinal?: boolean) => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  initialData?: any;
  saveDraft: () => void;
  isSubmitting: boolean;
}

interface TeachingRecord {
  id: string;
  semester: string;
  classYear: string;
  subjectName: string;
  lecturesPlanned: string;
  lecturesConducted: string;
  files: FileList | null;
  fileUrls?: string[]; 
}

interface EContentRecord {
  id: string;
  topicName: string;
  link: string;
  files: FileList | null;
  fileUrls?: string[]; 
}

interface InnovationRecord {
  id: string;
  subjectName: string;
  innovation: string;
  files: FileList | null;
  fileUrls?: string[]; 
}

export function TeachingWorkload({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialData,
  saveDraft,
  isSubmitting
}: TeachingWorkloadProps)  {
  // LA Teaching Workload State (20 Marks)
  const [teachingRecords, setTeachingRecords] = useState<TeachingRecord[]>(
    initialData?.teachingRecords || [{
      id: crypto.randomUUID(),
      semester: '',
      classYear: '',
      subjectName: '',
      lecturesPlanned: '',
      lecturesConducted: '',
      files: null
    }]
  );

  // LB.1 e-Content Development State (6 Marks)
  const [eContentRecords, setEContentRecords] = useState<EContentRecord[]>(
    initialData?.eContentRecords || [{
      id: crypto.randomUUID(),
      topicName: '',
      link: '',
      files: null
    }]
  );

  // LB.2 Innovation in Teaching State (4 Marks)
  const [innovationRecords, setInnovationRecords] = useState<InnovationRecord[]>(
    initialData?.innovationRecords || [{
      id: crypto.randomUUID(),
      subjectName: '',
      innovation: '',
      files: null
    }]
  );

  const [teachingScore, setTeachingScore] = useState(initialData?.teachingScore || '');
  const [pedagogyScore, setPedagogyScore] = useState(initialData?.pedagogyScore || '');

  // LA Methods
  const addNewTeachingRecord = () => {
    setTeachingRecords([
      ...teachingRecords,
      {
        id: crypto.randomUUID(),
        semester: '',
        classYear: '',
        subjectName: '',
        lecturesPlanned: '',
        lecturesConducted: '',
        files: null
      }
    ]);
  };

  const removeTeachingRecord = (id: string) => {
    if (teachingRecords.length > 1) {
      setTeachingRecords(teachingRecords.filter(record => record.id !== id));
    }
  };
  const uploadFiles = async (files: FileList | null): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'your_upload_preset');
  
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/your_cloud_name/upload`,
          { method: 'POST', body: formData }
        );
  
        if (!response.ok) {
          throw new Error('Upload failed');
        }
  
        const data = await response.json();
        return data.secure_url;
      });
  
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
      throw error;
    }
  };

  const updateTeachingRecord = async (id: string, field: string, value: any) => {
    if (field === 'files' && value) {
      try {
        const fileUrls = await uploadFiles(value);
        setTeachingRecords(
          teachingRecords.map(record =>
            record.id === id 
              ? { 
                  ...record, 
                  fileUrls: [...(record.fileUrls || []), ...fileUrls],
                  files: null // Clear the files after upload
                } 
              : record
          )
        );
      } catch (error) {
        toast.error('Failed to upload files');
      }
    } else {
      setTeachingRecords(
        teachingRecords.map(record =>
          record.id === id ? { ...record, [field]: value } : record
        )
      );
    }
  };

  // LB.1 Methods
  const addNewEContentRecord = () => {
    setEContentRecords([
      ...eContentRecords,
      {
        id: crypto.randomUUID(),
        topicName: '',
        link: '',
        files: null
      }
    ]);
  };

  const removeEContentRecord = (id: string) => {
    if (eContentRecords.length > 1) {
      setEContentRecords(eContentRecords.filter(record => record.id !== id));
    }
  };

  const updateEContentRecord = (id: string, field: keyof EContentRecord, value: string | FileList | null) => {
    setEContentRecords(
      eContentRecords.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  // LB.2 Methods
  const addNewInnovationRecord = () => {
    setInnovationRecords([
      ...innovationRecords,
      {
        id: crypto.randomUUID(),
        subjectName: '',
        innovation: '',
        files: null
      }
    ]);
  };

  const removeInnovationRecord = (id: string) => {
    if (innovationRecords.length > 1) {
      setInnovationRecords(innovationRecords.filter(record => record.id !== id));
    }
  };

  const updateInnovationRecord = (id: string, field: keyof InnovationRecord, value: string | FileList | null) => {
    setInnovationRecords(
      innovationRecords.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const handleSubmit = (e: React.FormEvent, isFinal = false) => {
    e.preventDefault();

    // Validate required fields
    if (!teachingScore || !pedagogyScore) {
      toast.error('Please fill all required scores');
      return;
    }

    const formData = {
      teachingRecords,
      eContentRecords,
      innovationRecords,
      teachingScore,
      pedagogyScore
    };
    onNext(formData, isFinal);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">1. Teaching Workload (30 Marks)</h2>

        {/* LA Teaching Workload Section (20 Marks) */}
        <div className="mb-8">
          <h3 className="font-medium mb-4">LA Teaching Workload (20 Marks)</h3>

          {teachingRecords.map((record, index) => (
            <div key={record.id} className="mb-6 border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Teaching Record {index + 1}</h4>
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeachingRecord(record.id)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Semester*</Label>
                  <Input
                    value={record.semester}
                    onChange={(e) => updateTeachingRecord(record.id, 'semester', e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>
                <div>
                  <Label>Class/Year*</Label>
                  <Input
                    value={record.classYear}
                    onChange={(e) => updateTeachingRecord(record.id, 'classYear', e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Subject Name*</Label>
                  <Input
                    value={record.subjectName}
                    onChange={(e) => updateTeachingRecord(record.id, 'subjectName', e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>
                <div>
                  <Label>Lectures Planned*</Label>
                  <Input
                    type="number"
                    min="0"
                    value={record.lecturesPlanned}
                    onChange={(e) => updateTeachingRecord(record.id, 'lecturesPlanned', e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Lectures Conducted*</Label>
                  <Input
                    type="number"
                    min="0"
                    value={record.lecturesConducted}
                    onChange={(e) => updateTeachingRecord(record.id, 'lecturesConducted', e.target.value)}
                    className="mt-1 w-full"
                    required
                  />
                </div>
                <div>
                  <Label>Supporting Documents</Label>
                  <Input
                    type="file"
                    onChange={(e) => updateTeachingRecord(record.id, 'files', e.target.files)}
                    className="mt-1 w-full"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <div className="w-48">
              <Label>Self-Appraisal Score (Out of 20)*</Label>
              <Input
                type="number"
                min="0"
                max="20"
                value={teachingScore}
                onChange={(e) => setTeachingScore(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button
              variant="outline"
              onClick={addNewTeachingRecord}
              className="flex items-center"
              type="button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Add Teaching Record
            </Button>
          </div>
        </div>

        {/* LB Teaching Pedagogy Section (10 Marks) */}
        <div className="mb-8">
          <h3 className="font-medium mb-6">LB Teaching Pedagogy (10 Marks)</h3>

          {/* LB.1 e-Content Development (6 Marks) */}
          <div className="mb-8">
            <h4 className="font-medium mb-4">LB.1 e-Content Development (6 Marks)</h4>

            {eContentRecords.map((record, index) => (
              <div key={record.id} className="mb-6 pl-4 border-l-4 border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">e-Content {index + 1}</h5>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEContentRecord(record.id)}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Topic Name*</Label>
                    <Input
                      value={record.topicName}
                      onChange={(e) => updateEContentRecord(record.id, 'topicName', e.target.value)}
                      className="mt-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <Label>Content Link*</Label>
                    <Input
                      type="url"
                      value={record.link}
                      onChange={(e) => updateEContentRecord(record.id, 'link', e.target.value)}
                      className="mt-1 w-full"
                      required
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>Supporting Documents</Label>
                  <Input
                    type="file"
                    onChange={(e) => updateEContentRecord(record.id, 'files', e.target.files)}
                    className="mt-1 w-full"
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addNewEContentRecord}
              className="flex items-center ml-4 mb-6"
              type="button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Add e-Content Record
            </Button>
          </div>

          {/* LB.2 Innovation in Teaching (4 Marks) */}
          <div className="mb-8">
            <h4 className="font-medium mb-4">LB.2 Innovation in Teaching (4 Marks)</h4>

            {innovationRecords.map((record, index) => (
              <div key={record.id} className="mb-6 pl-4 border-l-4 border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Innovation {index + 1}</h5>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInnovationRecord(record.id)}
                      className="text-red-500 hover:text-red-700"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Subject Name*</Label>
                    <Input
                      value={record.subjectName}
                      onChange={(e) => updateInnovationRecord(record.id, 'subjectName', e.target.value)}
                      className="mt-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <Label>Innovation Description*</Label>
                    <Input
                      value={record.innovation}
                      onChange={(e) => updateInnovationRecord(record.id, 'innovation', e.target.value)}
                      className="mt-1 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Supporting Documents</Label>
                  <Input
                    type="file"
                    onChange={(e) => updateInnovationRecord(record.id, 'files', e.target.files)}
                    className="mt-1 w-full"
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addNewInnovationRecord}
              className="flex items-center ml-4 mb-6"
              type="button"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Add Innovation Record
            </Button>

            <div className="w-48">
              <Label>Self-Appraisal Score (Out of 10)*</Label>
              <Input
                type="number"
                min="0"
                max="10"
                value={pedagogyScore}
                onChange={(e) => setPedagogyScore(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
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
          </div>
          <Button
            type="button" // Important: Use type="button" to prevent form submission
            onClick={(e) => handleSubmit(e, isLast)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isLast ? 'Submit Final' : 'Next'}
          </Button>
        </div>
      </div>
    </form>
  );
}