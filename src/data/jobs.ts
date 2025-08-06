
import type { Job } from "@/hooks/use-jobs";

export const initialJobsData: Omit<Job, 'id' | 'submittedByUid'>[] = [
    {
      title: "Senior Frontend Engineer",
      companyName: "Rani's Boutique",
      companyId: "ranis-boutique",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150,000 - $180,000",
      description: "Seeking a passionate Senior Frontend Engineer to build beautiful and performant user interfaces for our e-commerce platform.",
      applicationUrl: "#",
      postedAt: "2024-07-29T10:00:00Z"
    },
    {
      title: "Marketing Manager",
      companyName: "Saffron Spice Restaurant",
      companyId: "saffron-spice-restaurant",
      location: "Remote",
      type: "Part-time",
      description: "Join our team to lead marketing campaigns, manage social media, and drive growth for our beloved restaurant.",
      applicationUrl: "#",
      postedAt: "2024-07-28T14:30:00Z"
    },
    {
      title: "Data Scientist",
      companyName: "Bollywood Cinemas",
      companyId: "bollywood-cinemas",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      description: "Analyze viewership data, build recommendation models, and provide insights to optimize our movie distribution strategy.",
      applicationUrl: "#",
      postedAt: "2024-07-27T11:00:00Z"
    },
    {
      title: "Content Writer (Internship)",
      companyName: "Nirvana Yoga Studio",
      companyId: "nirvana-yoga-studio",
      location: "Austin, TX",
      type: "Internship",
      description: "Create engaging content for our blog, social media, and newsletters. A great opportunity for aspiring writers passionate about wellness.",
      applicationUrl: "#",
      postedAt: "2024-07-25T09:00:00Z"
    }
];
