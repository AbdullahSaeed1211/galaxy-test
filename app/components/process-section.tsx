export function ProcessSection() {
  const steps = [
    {
      number: "1",
      title: "Upload Video",
      description: "Upload your video in any common format with clear audio",
    },
    {
      number: "2",
      title: "Choose Caption Settings",
      description: "Select language, style, and positioning preferences for your captions",
    },
    {
      number: "3",
      title: "AI Processing",
      description: "Our AI transcribes audio and generates perfectly timed captions",
    },
    {
      number: "4",
      title: "Download Result",
      description: "Get your processed video with embedded captions in your chosen format",
    },
  ]

  return (
    <section className="py-10 md:py-16 mx-auto max-w-6xl">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight">How Our Video Caption Generator Works</h2>
        <div className="mt-8 grid gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7] text-white">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

