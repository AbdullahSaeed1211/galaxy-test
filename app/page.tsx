import { HeroSection } from "./components/hero-section"
import { UploadSection } from "./components/upload-section"
import { ExampleSection } from "./components/example-section"
import { FeaturesSection } from "./components/features-section"
import { ProcessSection } from "./components/process-section"
import { TargetUsersSection } from "./components/target-users-section"
import { FaqSection } from "./components/faq-section"

export default function VideoTransform() {
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
  )
}

