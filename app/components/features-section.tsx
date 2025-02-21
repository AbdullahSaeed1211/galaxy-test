import { Check } from "lucide-react"

export function FeaturesSection() {
  const features = [
    "Advanced Hunyuan-Video Model",
    "Multiple transformation styles",
    "Customizable intensity control",
    "High-quality output",
    "Fast processing time",
    "Original motion preservation",
    "Batch processing support",
    "Real-time preview options",
  ]

  return (
    <section className="py-12 md:py-16">
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Why Choose Our AI Video Transformer?</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Transform your videos with advanced AI technology that ensures high-quality style transfer while preserving
        the original content and motion of your videos.
      </p>
      <div className="mt-8 grid gap-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
  )
}

