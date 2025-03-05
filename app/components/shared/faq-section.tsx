export function FaqSection() {
  const faqs = [
    {
      question: "What PDF operations does your tool support?",
      answer:
        "Our platform supports a wide range of PDF operations including compression, conversion to various formats (Word, Excel, Images), merging multiple PDFs, splitting documents, password protection, digital signatures, and AI-powered features like document chat and summarization.",
    },
    {
      question: "How secure are my uploaded PDF documents?",
      answer:
        "We take security seriously. All uploaded files are processed through secure channels, stored temporarily with encryption, and automatically deleted after processing. We never access the content of your documents for any purpose other than providing the requested service.",
    },
    {
      question: "What are the file size limitations?",
      answer:
        "Our standard plan supports PDF files up to 100MB. For larger files, we offer premium plans that can handle documents up to 500MB. For enterprise needs with even larger files, please contact our support team.",
    },
    {
      question: "How does the AI PDF chat feature work?",
      answer:
        "Our AI PDF chat feature uses advanced natural language processing to analyze your document content. After uploading your PDF, you can ask questions about the content, and our AI will provide relevant answers based on the document's information, saving you time from manually searching through long documents.",
    },
  ]

  return (
    <section className="py-10 md:py-16 mx-auto max-w-6xl">  
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions About Our PDF Tools
        </h2>
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

