"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ExternalLink, MessageSquareWarning, Quote, Star } from "lucide-react"

interface Review {
  id: number
  author: string
  rating: number
  comment: string
  date: string
  source: string
  url: string
}

const SourceIcon = ({ source }: { source: string }) => {
  switch (source) {
    case "Google Maps":
      return <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3 h-3 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
    case "Şikayetvar":
      return <div className="w-3 h-3 bg-red-600 rounded-full flex items-center justify-center text-[6px] text-white font-bold group-hover:bg-red-500 transition-colors">Ş</div>
    default:
      return <MessageSquareWarning className="w-3 h-3 text-muted-foreground" />
  }
}

export function PowerOutageReviews({ dictionary }: { dictionary: any }) {
  const reviews: Review[] = [
    {
      id: 1,
      author: "Zeynep T.",
      rating: 1,
      comment: "Bitez'de 2 gündür elektrik yok, muhatap bulamıyoruz. Buzdolabındaki tüm ürünlerim bozuldu, rezillik.",
      date: "2 gün önce",
      source: "Şikayetvar",
      url: process.env.NEXT_PUBLIC_REVIEW_URL_SIKAYETVAR_AYDEM || "#"
    },
    {
      id: 2,
      author: "Murat S.",
      rating: 1,
      comment: "Sürekli voltaj dalgalanması var, televizyonun anakartı yandı. Yazıklar olsun verdiğimiz paralara.",
      date: "1 hafta önce",
      source: "Şikayetvar",
      url: process.env.NEXT_PUBLIC_REVIEW_URL_SIKAYETVAR_ADM || "#"
    },
    {
      id: 3,
      author: "Merve K.",
      rating: 1,
      comment: "Kesintiler artık dayanılmaz boyutta. En ufak yağmurda saatlerce gelmiyor. 2024 yılında hala orta çağdayız.",
      date: "3 gün önce",
      source: "Google Maps",
      url: process.env.NEXT_PUBLIC_REVIEW_URL_GOOGLE || "#"
    }
  ].sort((a, b) => {
    // Basic sorting logic for mock strings: '2 gün' vs '3 gün' vs '1 hafta'
    const getDays = (d: string) => {
      if (d.includes('gün')) return parseInt(d)
      if (d.includes('hafta')) return parseInt(d) * 7
      if (d.includes('ay')) return parseInt(d) * 30
      return 999
    }
    return getDays(a.date) - getDays(b.date)
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-amber-600" />
            Aydem Perakende - Bodrum
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={cn(
                    "w-4 h-4",
                    star <= 1 ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm font-semibold">1.1 / 5.0</span>
            <span className="text-xs text-muted-foreground mr-2">• 1,580+ yorum</span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs h-6 border-red-200 text-red-700 bg-red-50">
          Kritik Skor
        </Badge>
      </div>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-border/40 bg-secondary/20 backdrop-blur-sm hover:bg-secondary/30 transition-all group">
            <CardContent className="p-4 relative">
              <Quote className="absolute right-4 bottom-4 w-12 h-12 text-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-bodrum-blue/10 flex items-center justify-center text-xs font-bold text-bodrum-blue">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">{review.author}</p>
                    <div className="flex items-center mt-1.5">
                      <a 
                        href={review.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1.5 hover:underline group/link"
                      >
                        <SourceIcon source={review.source} />
                        <p className="text-[10px] text-muted-foreground group-hover/link:text-bodrum-blue transition-colors">
                          {review.date} • {review.source}
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={cn(
                          "w-3 h-3",
                          star <= review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"
                        )} 
                      />
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" asChild>
                    <a href={review.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-balance leading-relaxed italic text-muted-foreground">
                "{review.comment}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { Button } from "./ui/button"

