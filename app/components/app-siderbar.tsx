import { Home, FileText } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar"    
import { pdfTools } from "@/app/lib/toolsList"

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My PDFs",
    url: "/my-pdfs",
    icon: FileText,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col h-full bg-[#fafafa]">
          {/* Brand */}
          <div className="p-4">
            <Link href="/" className="text-xl font-bold text-gray-600">
              Galaxy PDF
            </Link>
          </div>

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-gray-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* PDF Tools Section */}
          <SidebarGroup className="flex-1 min-h-0">
            <SidebarGroupLabel>
              <div className="flex items-center justify-between">
                <span>PDF Tools</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <SidebarMenu>
                  {pdfTools.map((tool) => (
                    <SidebarMenuItem key={tool.id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/tools/${tool.id}`} className="flex items-center justify-between gap-2 [&_svg]:text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 flex items-center justify-center text-gray-600 [&>div]:!text-gray-600 [&_svg]:!text-gray-600 [&>div]:!w-5 [&>div]:!h-5 [&_svg]:!w-4 [&_svg]:!h-4">
                              {tool.icon}
                            </div>
                            <span className="text-sm truncate">{tool.name}</span>
                          </div>
                          {tool.trending && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-md shrink-0">
                              New
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User Profile - At Bottom */}
          <div className="mt-auto p-4 border-t flex justify-center">
            <UserButton showName={true} />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}