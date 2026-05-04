export interface PostedJob {
    id?: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    salary: string;
    postedBy: string;
    postedByEmail: string | null;
    postedAt: Date;
}