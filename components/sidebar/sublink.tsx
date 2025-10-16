import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LuChevronDown, LuChevronRight } from "react-icons/lu"

import { Paths } from "@/lib/pageroutes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/anchor"

function isRoute(
  item: Paths
): item is Extract<Paths, { title: string; href: string }> {
  return "title" in item && "href" in item
}

export default function SubLink(
  props: Paths & { level: number; isSheet: boolean }
) {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (
      isRoute(props) &&
      props.href &&
      path !== props.href &&
      path.includes(props.href)
    ) {
      setIsOpen(true)
    }
  }, [path, props])

  if (!isRoute(props)) {
    return null
  }

  const { title, href, items, noLink, level, isSheet } = props
  const isActive = path === href

  const Comp = (
    <Anchor 
      activeClassName="text-primary text-sm font-semibold" 
      href={href}
    >
      {title}
    </Anchor>
  )

  if (!items) {
    const titleOrLink = !noLink ? (
      isSheet ? (
        <SheetClose asChild>{Comp}</SheetClose>
      ) : (
        Comp
      )
    ) : (
      <h2 className="text-primary font-bold sm:text-sm">{title}</h2>
    )
    return <div className="flex flex-col text-sm">{titleOrLink}</div>
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {!noLink ? (
          <div className="mr-3 flex items-center gap-2 text-sm">
            {isSheet ? (
              <SheetClose asChild>{Comp}</SheetClose>
            ) : (
              Comp
            )}
            <CollapsibleTrigger asChild>
              <Button className="ml-auto h-6 w-6" variant="link" size="icon">
                {!isOpen ? (
                  <LuChevronRight className="h-[0.9rem] w-[0.9rem]" />
                ) : (
                  <LuChevronDown className="h-[0.9rem] w-[0.9rem]" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        ) : (
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between p-0 m-0 h-auto font-normal text-primary hover:bg-transparent text-left bg-transparent border-0 cursor-pointer text-sm">
              <span className="text-primary m-0">{title}</span>
              {!isOpen ? (
                <LuChevronRight className="h-[0.9rem] w-[0.9rem] ml-2" />
              ) : (
                <LuChevronDown className="h-[0.9rem] w-[0.9rem] ml-2" />
              )}
              <span className="sr-only">Toggle</span>
            </button>
          </CollapsibleTrigger>
        )}
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              "mt-3 flex flex-col items-start gap-3 border-l pl-4 text-sm",
              level > 0 && "ml-1 border-l pl-4"
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) {
                return null
              }

              const modifiedItems = {
                ...innerLink,
                href: `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
