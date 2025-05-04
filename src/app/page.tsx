import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Header from '@/components/header';
import Hero from '@/components/hero';

export default function Home() {
  return (
    // <main className="min-h-screen p-24">
      // <SignedOut>
      //   <div className="text-center">
      //     <h1 className="text-4xl font-bold mb-6">Faculty Portal</h1>
      //     <div className="space-x-4">
      //       <Link href="/sign-in" className="btn-primary">
      //         Sign In
      //       </Link>
      //       <Link href="/sign-up" className="btn-secondary">
      //         Sign Up
      //       </Link>
      //     </div>
      //   </div>
      // </SignedOut>
      // <SignedIn>
      //   <div className="text-center">
      //     <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
      //     <Link href="/dashboard" className="btn-primary">
      //       Go to Dashboard
      //     </Link>
      //   </div>
      // </SignedIn>
    // </main>
    <div className="min-h-screen">
      <Header />
      <Hero />
    </div>
  );
}