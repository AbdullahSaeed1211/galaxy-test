import { Check } from "lucide-react"

export function FeaturesSection() {
  const features = [
    "PDF Compression with Quality Preservation",
    "Convert PDFs to Word, Excel, and Image Formats",
    "Merge Multiple PDFs into One Document",
    "Split PDFs into Separate Files",
    "Password Protection and Encryption",
    "Digital Signature Integration",
    "AI-Powered PDF Chat and Analysis",
    "OCR for Scanned Documents",
  ]

  return (
    <section className="py-10 md:py-16 mx-auto max-w-6xl">
    <div className="container px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Why Choose Our PDF Tools?</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Our comprehensive suite of PDF tools helps you manage, edit, and extract value from your documents with 
        ease. From basic operations to advanced AI-powered features, we've got all your PDF needs covered.
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

