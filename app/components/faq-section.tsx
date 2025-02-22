export function FaqSection() {
  const faqs = [
    {
      question: "What is AI Video-to-Video Transformation?",
      answer:
        "It's an advanced technology powered by the Fal API's Hunyuan-Video Model that transforms videos into different artistic styles while preserving the original content and motion. This allows you to create unique visual experiences from your existing videos.",
    },
    {
      question: "What styles and options are available?",
      answer:
        "We offer multiple transformation styles including anime, cartoon, and realistic. Each style can be fine-tuned using an intensity slider, allowing you to achieve the perfect balance for your content.",
    },
    {
      question: "How long does the transformation process take?",
      answer:
        "Processing time varies based on video length and chosen style. Most videos are transformed within 5-15 minutes. We also offer batch processing for multiple videos and real-time preview for short segments.",
    },
    {
      question: "What are the technical requirements?",
      answer:
        "We support common video formats (MP4, MOV, AVI, WebM) with a maximum file size of 500MB. The output video maintains the original resolution and quality while applying the chosen style transformation.",
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

