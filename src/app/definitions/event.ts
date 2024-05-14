export interface Event {
    id: string;
    name: string;
    description: string;
    themes: string[];
    startDate: Date;
    endDate: Date;
    defaultImage: string | null;
    isActive: boolean | null;
}