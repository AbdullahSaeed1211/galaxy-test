import { Users, Globe, MessageSquare, Share2, Video, Building2 } from "lucide-react"

export function TargetUsersSection() {
  const users = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Content Creators",
      description: "Add professional captions to videos for better engagement and reach.",
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Businesses",
      description: "Reach international audiences with multi-language caption support.",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Educational Institutions",
      description: "Make educational content accessible to all students with accurate captions.",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Social Media Managers",
      description: "Increase video engagement with auto-generated captions for social platforms.",
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Producers",
      description: "Streamline post-production workflow with automated caption generation.",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Corporate Communications",
      description: "Ensure all corporate videos are accessible and professional.",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <section className="py-12 md:py-16 mx-auto max-w-6xl">  
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Who Can Benefit from Our AI Video-to-Video Transformation?
        </h2>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Our tool is designed for content creators and professionals who need quick, high-quality video
          transformations.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, i) => (
            <div
              key={i}
              className="flex flex-col rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${user.bgColor}`}>
                <div className={user.iconColor}>{user.icon}</div>
              </div>
              <h3 className="text-xl font-semibold">{user.title}</h3>
              <p className="mt-2 text-muted-foreground">{user.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

