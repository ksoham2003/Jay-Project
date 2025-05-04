// lib/validate.ts
import { FormData } from '@/types';

export function validateFormData(data: FormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Add validation logic for each section
  if (data.teaching) {
    data.teaching.teachingRecords.forEach(record => {
      if (!record.semester) errors.push('Teaching: Semester is required');
      // Add more validations
    });
  }
  
  // Validate other sections similarly
  
  return {
    valid: errors.length === 0,
    errors
  };
}