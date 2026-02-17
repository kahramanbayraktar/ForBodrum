"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = (locale: string) => {
    if (!pathname) return
    const segments = pathname.split("/")
    // segments[0] is empty because path starts with /
    // segments[1] is the locale (en or tr)
    segments[1] = locale
    const newPath = segments.join("/")
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 shrink-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("tr")}>
          <span className="mr-2">🇹🇷</span> Türkçe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
