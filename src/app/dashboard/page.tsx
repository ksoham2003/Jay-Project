'use client';
import { useEffect, useState } from 'react';
import { useAuth, UserButton } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { Copy, Trash2 } from 'lucide-react';

interface Submission {
  _id: string;
  userId: string;
  status: 'draft' | 'submitted';
  updatedAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  if (!userId) redirect('/sign-in');

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/submissions');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      
      setSubmissions(data);
    } catch (error) {
      toast.error((error instanceof Error ? error.message : 'An unknown error occurred') || 'Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSubmission = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/create-sar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create form');
      }
  
      if (!result.data?._id) {
        throw new Error('Invalid response from server - missing form ID');
      }
  
      // Navigate to the new form
      router.push(`/dashboard/sar-form/${result.data._id}`);
      toast.success('New SAR form created successfully');
    } catch (error) {
      console.error('Form creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create form');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloneForm = async (id: string) => {
    try {
      const response = await fetch(`/api/clone-sar?id=${id}`);
      if (!response.ok) throw new Error('Failed to clone form');
      
      const newForm = await response.json();
      toast.success('Form cloned successfully');
      router.push(`/dashboard/sar-form/${newForm._id}`);
    } catch (error) {
      console.error('Error cloning form:', error);
      toast.error('Failed to clone form');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const response = await fetch(`/api/delete-sar?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Submission deleted');
        fetchSubmissions();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SAR Submissions</h1>
        <div className="flex items-center gap-4">
          <Button onClick={createNewSubmission} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create New SAR Form'}
          </Button>
          <UserButton afterSignOutUrl='/'/>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No submissions found</p>
          <Button onClick={createNewSubmission} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Your First SAR Form'}
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell className="font-medium">
                  {submission._id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    submission.status === 'submitted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(submission.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    onClick={() => router.push(`/dashboard/sar-form/${submission._id}`)}
                  >
                    {submission.status === 'draft' ? 'Continue Editing' : 'View'}
                  </Button>
                  {submission.status === 'submitted' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCloneForm(submission._id)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Clone
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(submission._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}