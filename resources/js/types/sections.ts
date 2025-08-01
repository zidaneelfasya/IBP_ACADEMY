import type React from "react";
export interface TimelineItem {
    date: string;
    phase: string;
    description: string;
}

export interface ContactPerson {
    name: string;
    whatsapp: string;
    instagram?: string;
    line?: string;
}

export interface Prize {
    title: string;
    prize: string;
    benefits: string;
    gradient: string;
    icon: string;
}

export interface CTAButton {
    text: string;
    href: string;
    type: "primary" | "secondary";
    icon?: React.ReactNode;
    external?: boolean;
}

export interface VisualImages {
    main: string;
    secondary: string[];
}
