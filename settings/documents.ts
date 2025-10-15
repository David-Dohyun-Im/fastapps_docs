type DocumentPaths =
  | {
      title: string
      href: string
      noLink?: true
      heading?: string
      items?: DocumentPaths[]
    }
  | {
      spacer: true
    }

export const Documents: DocumentPaths[] = [
  {
    heading: "Overview",
    title: "Introduction",
    href: "/introduction",
  },
  {
    spacer: true,
  },
  {
    heading: "Getting Started",
    title: "Quick Start",
    href: "/quickstart",
  },
  {
    title: "Tutorial",
    href: "/tutorial",
  },
  {
    spacer: true,
  },
  {
    heading: "Build",
    title: "Project Setup",
    href: "/project-setup",
  },
  {
    title: "Building Widgets",
    href: "/widgets",
  },
  {
    title: "Building Tools",
    href: "/tools",
  },
  {
    spacer: true,
  },
  {
    heading: "Advanced",
    title: "Managing State",
    href: "/state",
  },
  {
    title: "Styling Guide",
    href: "/styling",
  },
  {
    title: "API Integration",
    href: "/api-integration",
  },
  {
    title: "API Reference",
    href: "/api-reference",
  },
]
