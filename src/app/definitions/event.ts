export interface Event {
    id: string;
    name: string;
    description: string;
    themes: string[];
    startDate: Date;
    endDate: Date;
    randomImage: string | null;
}