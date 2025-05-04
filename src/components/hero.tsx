// components/hero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Revolutionizing Faculty Self-Appraisal for Career Growth
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          Empower your academic journey with our self-appraisal system designed for faculty members
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/features">Explore System</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo">Request a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}