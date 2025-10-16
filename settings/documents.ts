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
    noLink: true,
    items: [
      {
        title: "Widget Basics",
        href: "/basics",
      },
      {
        title: "React Hooks",
        href: "/react-hooks",
      },
      {
        title: "Advanced Patterns",
        href: "/advanced-patterns",
      },
    ],
  },
  {
    title: "Building Tools",
    href: "/tools",
    noLink: true,
    items: [
      {
        title: "Tool Basics",
        href: "/basics",
      },
      {
        title: "Advanced Patterns",
        href: "/advanced",
      },
      {
        title: "API Integration",
        href: "/integration",
      },
    ],
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
