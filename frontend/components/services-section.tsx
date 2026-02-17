import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Camera, Map as MapIcon, Users, Zap } from "lucide-react"

interface ServicesSectionProps {
  onReportClick: () => void
  onMapClick: () => void
  onOutageClick: () => void
  dictionary: any
}

export function ServicesSection({ onReportClick, onMapClick, onOutageClick, dictionary }: ServicesSectionProps) {
  const services = [
    {
      title: dictionary.home.services.report_issue.title,
      description: dictionary.home.services.report_issue.description,
      icon: Camera,
      action: {
        label: dictionary.home.services.report_issue.button,
        onClick: onReportClick,
        variant: "default" as const
      }
    },
    {
      title: dictionary.home.services.ai_analysis.title,
      description: dictionary.home.services.ai_analysis.description,
      icon: BrainCircuit,
    },
    {
      title: dictionary.home.services.map_tracking.title,
      description: dictionary.home.services.map_tracking.description,
      icon: MapIcon,
      action: {
        label: dictionary.home.services.map_tracking.button,
        onClick: onMapClick,
        variant: "outline" as const
      }
    },
    {
      title: dictionary.home.services.community_power.title,
      description: dictionary.home.services.community_power.description,
      icon: Users,
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-full overflow-y-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-bodrum-blue">
          {dictionary.home.hero_title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {dictionary.home.hero_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Power Outage Card - Featured */}
        <Card className="col-span-1 md:col-span-2 border-amber-200 bg-amber-50/50 hover:border-amber-300 transition-colors shadow-sm hover:shadow-md">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-amber-900">{dictionary.home.services.power_outage.title}</CardTitle>
                <CardDescription className="text-base mt-1 text-amber-700/80">
                  {dictionary.home.services.power_outage.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
              onClick={onOutageClick}
            >
              {dictionary.home.services.power_outage.button}
            </Button>
          </CardContent>
        </Card>

        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <Card key={index} className="border-border/50 hover:border-bodrum-blue/50 transition-colors shadow-sm hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-bodrum-blue/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-bodrum-blue" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              {service.action && (
                <CardContent>
                  <Button 
                    variant={service.action.variant} 
                    onClick={service.action.onClick}
                    className="w-full sm:w-auto"
                  >
                    {service.action.label}
                  </Button>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
