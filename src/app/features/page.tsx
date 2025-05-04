// app/features/page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-foreground mb-8">
          Automated System for Career Advancements
        </h1>
        
        <div className="bg-card p-8 rounded-lg shadow-md mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Explore the innovative features of our system designed to enhance faculty career growth and development.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button asChild>
              <Link href="/sign-in" className="btn-primary">
                Faculty Login
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/admin-login" className="btn-secondary">
                Admin Login
              </Link>
            </Button>
          </div>
        </div>
        
        <footer className="text-center text-muted-foreground text-sm mt-12">
          © 2024 DYPCET. All rights reserved.
        </footer>
      </div>
    </div>
  );
}