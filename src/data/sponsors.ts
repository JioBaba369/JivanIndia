
import type { Sponsor } from "@/hooks/use-sponsors";

export const initialSponsors: Omit<Sponsor, 'id'>[] = [
    {
      name: "Innovate Corp",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.innovatecorp.com",
      industry: "Technology",
      tier: "Platinum",
      description: "Driving innovation forward with cutting-edge technology solutions.",
      fullDescription: "Innovate Corp is a global leader in enterprise software and cloud solutions. We are proud to support community initiatives that foster technological literacy and growth.",
      contactEmail: "sponsorship@innovatecorp.com",
      contactPhone: "1-800-555-0101",
      address: "1 Tech Plaza, Silicon Valley, CA 94043",
      socialMedia: {
        twitter: "https://twitter.com/innovatecorp",
        linkedin: "https://linkedin.com/company/innovatecorp"
      },
      eventsSponsored: [
        { eventId: "1", contribution: "Title Sponsor" },
        { eventId: "3", contribution: "Technology Partner" }
      ]
    },
    {
      name: "Unity Bank",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.unitybank.com",
      industry: "Finance",
      tier: "Gold",
      description: "Your trusted partner in financial growth and stability.",
      fullDescription: "Unity Bank provides comprehensive financial services to individuals and businesses. Our commitment to the community is reflected in our support for local events and organizations that enrich cultural life.",
      contactEmail: "community@unitybank.com",
      contactPhone: "1-800-555-0102",
      address: "100 Finance Ave, New York, NY 10004",
       socialMedia: {
        linkedin: "https://linkedin.com/company/unitybank"
      },
      eventsSponsored: [
        { eventId: "1", contribution: "Gold Sponsor" },
        { eventId: "2", contribution: "Financial Wellness Partner" }
      ]
    },
    {
      name: "Taste of India Grocers",
      logoUrl: "https://placehold.co/400x200.png",
      website: "www.tasteofindiagrocers.com",
      industry: "Retail",
      tier: "Silver",
      description: "Authentic ingredients for your kitchen.",
      fullDescription: "Taste of India Grocers is your one-stop shop for authentic spices, produce, and ingredients. We are delighted to sponsor events that bring the flavors and traditions of India to the community.",
      contactEmail: "info@tasteofindiagrocers.com",
      contactPhone: "1-800-555-0103",
      address: "500 Spice Route, Edison, NJ 08820",
      socialMedia: {
        facebook: "https://facebook.com/tasteofindiagrocers"
      },
      eventsSponsored: [
        { eventId: "2", contribution: "Food and Beverage Sponsor" }
      ]
    }
];
