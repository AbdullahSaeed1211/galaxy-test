import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UploadSection } from './components/upload-section';
import { HeroSection } from './components/hero-section';
import { ExampleSection } from './components/example-section';
import { FeaturesSection } from './components/features-section';
import { ProcessSection } from './components/process-section';
import { TargetUsersSection } from './components/target-users-section';
import { FaqSection } from './components/faq-section';

export default async function HomePage() {
  const { userId } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <UploadSection />
      <ExampleSection />
      <FeaturesSection />
      <ProcessSection />
      <TargetUsersSection />
      <FaqSection />
    </div>
  );
}

