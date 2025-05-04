'use client';
import { useEffect, useState, use } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  TeachingWorkload,
  StudentFeedback,
  AdminResponsibilities,
  EvaluationAssessment 
} from '@/components/sar-form';
import type { FormData, FormSection } from '@/types';
import { Button } from '@/components/ui/button';

const formSections: FormSection[] = [
  { id: 'teaching', component: TeachingWorkload, title: "1. Teaching Workload" },
  { id: 'feedback', component: StudentFeedback, title: "2. Student Feedback" },
  { id: 'admin', component: AdminResponsibilities, title: "3. Admin Responsibilities" },
  { id: 'evaluation', component: EvaluationAssessment, title: "4. Evaluation & Assessment" }
];

export default function SARFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { userId } = useAuth();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const createNewFormData = (userId: string): FormData => ({
    status: 'draft',
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    teaching: {
      teachingRecords: [createTeachingRecord()],
      eContentRecords: [createEContentRecord()],
      innovationRecords: [createInnovationRecord()],
      teachingScore: '',
      pedagogyScore: ''
    },
    feedback: {
      feedbacks: [createFeedbackRecord()],
      selfAppraisalScore: ''
    },
    admin: {
      responsibilities: [createResponsibilityRecord()],
      selfAppraisalScore: ''
    },
    evaluation: {
      resultAnalysis: createResultAnalysis(),
      examDuties: createExamDuties(),
      selfAppraisalScore: ''
    }
  });

  const createTeachingRecord = () => ({
    id: crypto.randomUUID(),
    semester: '',
    classYear: '',
    subjectName: '',
    lecturesPlanned: '',
    lecturesConducted: '',
    files: null,
    fileUrls: []
  });

  const createEContentRecord = () => ({
    id: crypto.randomUUID(),
    topicName: '',
    link: '',
    files: null,
    fileUrls: []
  });

  const createInnovationRecord = () => ({
    id: crypto.randomUUID(),
    subjectName: '',
    innovation: '',
    files: null,
    fileUrls: []
  });

  const createFeedbackRecord = () => ({
    id: crypto.randomUUID(),
    semester: '',
    subjectName: '',
    feedback: '',
    average: '',
    files: null,
    fileUrls: []
  });

  const createResponsibilityRecord = () => ({
    id: crypto.randomUUID(),
    level: '',
    name: '',
    files: null,
    fileUrls: []
  });

  const createResultAnalysis = () => ({
    semester: '',
    subjectName: '',
    passingPercentage: '',
    files: null,
    fileUrls: []
  });

  const createExamDuties = () => [
    { id: 1, name: 'Paper Setting', details: '', score: '', validated: false },
    { id: 2, name: 'Paper Assessment', details: '', score: '', validated: false },
    { id: 3, name: 'Supervision', details: '', score: '', validated: false },
    { id: 4, name: 'Internal Examiner Day', details: '', score: '', validated: false },
    { id: 5, name: 'Flying Squad', details: '', score: '', validated: false },
    { id: 6, name: 'CAP Director', details: '', score: '', validated: false }
  ];

  const updateCompletedSections = (data: FormData) => {
    const completed = formSections
      .map((_, index) => index)
      .filter(index => data[formSections[index].id as keyof FormData]);
    setCompletedSections(completed);
  };

  const fetchFormData = async () => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }
  
    try {
      setIsLoading(true);
      
      if (id === 'new') {
        // For new forms, create local data but don't save yet
        setFormData(createNewFormData(userId));
        return;
      }
  
      // For existing forms, fetch from API
      const response = await fetch(`/api/submissions/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Form not found');
          router.push('/dashboard');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setFormData(data);
      updateCompletedSections(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load form data');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, [id, userId, router]);

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const CurrentComponent = formSections[currentSection].component;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">SAR Form (Self-Appraisal Report)</h1>
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard')}
          disabled={isSubmitting}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <div className="flex mb-8 overflow-x-auto pb-2">
        {formSections.map((section, index) => (
          <div key={section.id} className="flex items-center shrink-0">
            <button
              onClick={() => setCurrentSection(index)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                index === currentSection
                  ? 'bg-primary text-white'
                  : completedSections.includes(index)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {section.title}
            </button>
            {index < formSections.length - 1 && (
              <div className="mx-2 text-gray-400">›</div>
            )}
          </div>
        ))}
      </div>

      <CurrentComponent 
        onNext={(data) => console.log('Next:', data)} 
        onPrevious={() => setCurrentSection(prev => Math.max(0, prev - 1))}
        isFirst={currentSection === 0}
        isLast={currentSection === formSections.length - 1}
        initialData={formData[formSections[currentSection].id as keyof FormData]}
        saveDraft={() => console.log('Save draft')}
        isSubmitting={isSubmitting}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">File Upload Guidelines</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Maximum file size: 5MB</li>
          <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
          <li>• Files are saved automatically when selected</li>
        </ul>
      </div>
    </div>
  );
}