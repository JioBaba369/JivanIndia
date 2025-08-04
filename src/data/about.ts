export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  initials: string;
  bio: string;
}

export interface AboutContent {
  story: string;
  teamMembers: TeamMember[];
}

export const initialAboutContent: AboutContent = {
  story: `In our daily lives, we saw how challenging it could be to keep track of cultural events, find trusted local businesses, or connect with community organizations. Information was scattered across social media groups, outdated websites, and word-of-mouth, making it difficult to feel truly tapped into the pulse of the community.\n\nWe envisioned a single, reliable, and beautiful platform where all this information could live, breathe, and be easily accessible to everyone. Our platform is more than just a directory; it's a dynamic ecosystem designed to empower every member of the Indian community. Whether you're looking to attend a local Diwali celebration, find a new job, support an Indian-owned business, or join a cultural group, JivanIndia.co is your starting point.`,
  teamMembers: [
    {
        id: '1',
        name: "Priya Sharma",
        role: "Co-Founder & Community Lead",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=200",
        initials: "PS",
        bio: "With a background in community organizing, Priya is passionate about creating spaces where people feel they belong."
    },
    {
        id: '2',
        name: "Rohan Gupta",
        role: "Co-Founder & Tech Lead",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwwfHx8fDE3NTQxOTc0MzZ8MA&ixlib=rb-4.1.0&q=80&w=200",
        initials: "RG",
        bio: "Rohan is a software architect dedicated to building technology that empowers and connects communities."
    }
  ]
};
