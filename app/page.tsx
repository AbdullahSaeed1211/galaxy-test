import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PdfToolsSection } from './components/pdf-tools-section';


export default async function HomePage() {
  const { userId } = await auth();
  

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen w-full">
      <PdfToolsSection />
     
    </div>
  );
}

