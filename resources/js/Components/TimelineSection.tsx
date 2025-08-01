"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { CheckCircle, Calendar, Users, Rocket, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineItem {
  id: string
  date: string
  title: string
  description: string
  icon: React.ReactNode
  status: "completed" | "current" | "upcoming"
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    date: "January 2023",
    title: "Company Founded",
    description: "Started our journey with a vision to revolutionize the industry and create meaningful impact.",
    icon: <Rocket className="w-5 h-5" />,
    status: "completed",
  },
  {
    id: "2",
    date: "March 2023",
    title: "First Product Launch",
    description: "Successfully launched our MVP with core features that solved real customer problems.",
    icon: <Star className="w-5 h-5" />,
    status: "completed",
  },
  {
    id: "3",
    date: "June 2023",
    title: "10K Users Milestone",
    description: "Reached our first major user milestone, validating product-market fit and user satisfaction.",
    icon: <Users className="w-5 h-5" />,
    status: "completed",
  },
  {
    id: "4",
    date: "September 2023",
    title: "Series A Funding",
    description: "Secured Series A funding to accelerate growth and expand our team of talented individuals.",
    icon: <Trophy className="w-5 h-5" />,
    status: "current",
  },
  {
    id: "5",
    date: "Q1 2024",
    title: "Global Expansion",
    description: "Planning to expand our services globally and enter new markets across different continents.",
    icon: <Calendar className="w-5 h-5" />,
    status: "upcoming",
  },
]

export default function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id")
            if (id) {
              setVisibleItems((prev) => new Set([...prev, id]))
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    itemRefs.current.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const setItemRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element)
    } else {
      itemRefs.current.delete(id)
    }
  }

  return (
    <section className="flex items-center justify-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Journey</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From humble beginnings to industry leadership. Here's how we've grown and evolved over time.
            </p>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted-foreground/20 transform md:-translate-x-0.5" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => {
              const isVisible = visibleItems.has(item.id)
              const isEven = index % 2 === 0

              return (
                <div
                  key={item.id}
                  ref={(el) => setItemRef(item.id, el)}
                  data-id={item.id}
                  className={cn(
                    "relative flex items-center transition-all duration-700 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                    "md:justify-center",
                  )}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:flex items-center w-full">
                    {/* Left Content (for odd items) */}
                    <div
                      className={cn(
                        "w-5/12 transition-all duration-700 ease-out",
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : isEven
                            ? "opacity-0 translate-x-8"
                            : "opacity-0 -translate-x-8",
                        !isEven && "order-3",
                      )}
                    >
                      {isEven && <TimelineCard item={item} align="right" />}
                    </div>

                    {/* Center Icon */}
                    <div className="flex-shrink-0 mx-4 order-2">
                      <TimelineIcon item={item} isVisible={isVisible} />
                    </div>

                    {/* Right Content (for even items) */}
                    <div
                      className={cn(
                        "w-5/12 transition-all duration-700 ease-out",
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : isEven
                            ? "opacity-0 -translate-x-8"
                            : "opacity-0 translate-x-8",
                        isEven && "order-3",
                      )}
                    >
                      {!isEven && <TimelineCard item={item} align="left" />}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex items-start w-full pl-12">
                    <div className="absolute left-0">
                      <TimelineIcon item={item} isVisible={isVisible} />
                    </div>
                    <div
                      className={cn(
                        "transition-all duration-700 ease-out",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                      )}
                    >
                      <TimelineCard item={item} align="left" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineIcon({ item, isVisible }: { item: TimelineItem; isVisible: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-500 ease-out transform",
        isVisible ? "scale-100 rotate-0" : "scale-75 rotate-45",
        item.status === "completed"
          ? "bg-primary border-primary text-primary-foreground"
          : item.status === "current"
            ? "bg-background border-primary text-primary animate-pulse"
            : "bg-background border-muted-foreground text-muted-foreground",
      )}
    >
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      >
        {item.status === "completed" ? <CheckCircle className="w-6 h-6" /> : item.icon}
      </div>

      {/* Pulse effect for current item */}
      {item.status === "current" && (
        <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20" />
      )}
    </div>
  )
}

function TimelineCard({ item, align }: { item: TimelineItem; align: "left" | "right" }) {
  return (
    <div
      className={cn(
        "group relative p-6 bg-background rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-1",
        align === "right" && "text-right",
      )}
    >
      {/* Arrow for desktop */}
      <div
        className={cn(
          "hidden md:block absolute top-6 w-0 h-0 border-t-8 border-b-8 border-t-transparent border-b-transparent",
          align === "right"
            ? "right-0 translate-x-full border-l-8 border-l-border"
            : "left-0 -translate-x-full border-r-8 border-r-border",
        )}
      />

      <div className="space-y-2">
        <div className={cn("text-sm font-medium text-primary", align === "right" && "text-right")}>{item.date}</div>
        <h3
          className={cn(
            "text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200",
            align === "right" && "text-right",
          )}
        >
          {item.title}
        </h3>
        <p className={cn("text-sm text-muted-foreground leading-relaxed", align === "right" && "text-right")}>
          {item.description}
        </p>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          "absolute top-2 w-2 h-2 rounded-full",
          align === "right" ? "left-2" : "right-2",
          item.status === "completed"
            ? "bg-green-500"
            : item.status === "current"
              ? "bg-blue-500 animate-pulse"
              : "bg-gray-400",
        )}
      />
    </div>
  )
}
