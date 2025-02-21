import { Play } from "lucide-react"

export function ExampleSection() {
  const examples = [
    {
      original: "/placeholder.svg?height=200&width=350",
      transformed: "/placeholder.svg?height=200&width=350",
      style: "Anime Style",
    },
    {
      original: "/placeholder.svg?height=200&width=350",
      transformed: "/placeholder.svg?height=200&width=350",
      style: "Cartoon Style",
    },
  ]

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Example Transformations</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {examples.map((example, i) => (
            <div key={i} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group relative overflow-hidden rounded-lg">
                  <img
                    src={example.original || "/placeholder.svg"}
                    alt="Original video thumbnail"
                    className="aspect-video w-full object-cover"
                    width={350}
                    height={200}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                    Original
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-lg">
                  <img
                    src={example.transformed || "/placeholder.svg"}
                    alt="Transformed video thumbnail"
                    className="aspect-video w-full object-cover"
                    width={350}
                    height={200}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-full bg-[#6C5CE7]/70 px-3 py-1 text-xs text-white">
                    {example.style}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

