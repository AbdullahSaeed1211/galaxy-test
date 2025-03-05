import { Users, Globe, MessageSquare, Briefcase, FileText, Building2 } from "lucide-react"

export function TargetUsersSection() {
  const users = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Students & Researchers",
      description: "Compress, merge, and annotate academic papers and research documents.",
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Legal Professionals",
      description: "Securely sign, encrypt, and manage confidential legal documents.",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Educational Institutions",
      description: "Convert and organize educational materials for better accessibility.",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Business Professionals",
      description: "Streamline document workflows with efficient PDF processing tools.",
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Content Publishers",
      description: "Convert and optimize documents for digital publishing platforms.",
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Corporate Administrators",
      description: "Manage, archive, and secure company documentation efficiently.",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <section className="py-10 md:py-16 mx-auto max-w-6xl">  
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Who Can Benefit from Our PDF Tools?
        </h2>
        <p className="mt-4 text-center text-lg text-muted-foreground">
          Our comprehensive PDF toolkit is designed for professionals, students, and organizations who need
          efficient document management solutions.
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

