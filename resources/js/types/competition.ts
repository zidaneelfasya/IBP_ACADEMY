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

export interface CompetitionProps {
    timeline?: TimelineItem[];
    contacts?: ContactPerson[];
    guidebookUrl?: string;
    registerUrl?: string;
}
