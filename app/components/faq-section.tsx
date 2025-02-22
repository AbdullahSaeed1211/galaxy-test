export function FaqSection() {
  const faqs = [
    {
      question: "What is AI Video-to-Video Transformation?",
      answer:
        "It's an advanced technology powered by the Fal API's Hunyuan-Video Model that transforms videos based on text prompts while preserving the original content and motion. This allows you to create unique visual experiences from your existing videos using natural language descriptions.",
    },
    {
      question: "How does the prompt-based transformation work?",
      answer:
        "Simply describe the style or look you want to achieve using natural language prompts. Our AI model will interpret your description and transform the video accordingly. You can also customize technical parameters like resolution and aspect ratio for optimal results.",
    },
    {
      question: "How long does the transformation process take?",
      answer:
        "Processing time varies based on video length and complexity of the transformation. Most videos are transformed within 5-15 minutes. The processing time may also depend on the chosen resolution and number of frames.",
    },
    {
      question: "What are the technical requirements?",
      answer:
        "We support common video formats (MP4, MOV, AVI, WebM) with a maximum file size of 500MB. You can choose between different resolutions (480p, 580p, 720p) and aspect ratios (16:9, 9:16) for the output video.",
    },
  ]

  return (
    <section className="py-12 md:py-16 mx-auto max-w-6xl">  
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight">
        Frequently Asked Questions About Our AI Video Transformer        </h2>
        <div className="mt-8 grid gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <p className="mt-2 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

