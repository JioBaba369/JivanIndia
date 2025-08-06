
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

export interface AboutContent {
  story: string;
  teamMembers: TeamMember[];
  adminUids?: string[];
}

export const initialAboutContent: AboutContent = {
    story: `JivanIndia.co began as a simple conversation among friends, new to a country far from home. We missed the vibrant festivals, the familiar flavors, and the easy camaraderie of our communities back in India. We found ourselves constantly searching—for local temples, for the best place to buy spices, for cultural events that felt like a piece of home.

Information was scattered across countless websites, social media groups, and word-of-mouth recommendations. It was a chore to piece everything together. We dreamed of a single, reliable place where the Indian diaspora could connect, share, and thrive. A digital 'jivan'—a source of life and vitality for our community.

That dream became JivanIndia.co.

We started by building a simple calendar of events. As more people joined, we added a directory for community organizations, then a space for local businesses to share deals, and a section for the latest movies from home. It grew organically, fueled by the needs and contributions of people just like us.

Today, JivanIndia.co is more than just a website. It's a bustling hub, a digital town square where traditions are celebrated, connections are forged, and the spirit of India is kept alive, no matter where we are in the world. Our journey is a testament to the power of community, and we invite you to be a part of it.`,
    teamMembers: [
      {
        id: '1',
        name: 'Priya Sharma',
        role: 'Founder & CEO',
        bio: 'Priya is the visionary behind JivanIndia.co, driven by a passion for connecting communities and celebrating cultural heritage.',
        avatarUrl: 'https://placehold.co/400x400.png',
      },
      {
        id: '2',
        name: 'Rohan Mehta',
        role: 'Head of Technology',
        bio: 'Rohan is the architectural mastermind, ensuring the platform is robust, secure, and user-friendly for everyone.',
        avatarUrl: 'https://placehold.co/400x400.png',
      },
       {
        id: '3',
        name: 'Anika Gupta',
        role: 'Community Engagement Lead',
        bio: 'Anika is the heart of our outreach, building relationships with organizations and users to foster a vibrant ecosystem.',
        avatarUrl: 'https://placehold.co/400x400.png',
      },
       {
        id: '4',
        name: 'Vikram Singh',
        role: 'Marketing & Partnerships',
        bio: 'Vikram drives our growth, forging partnerships with businesses and sponsors that bring value to the community.',
        avatarUrl: 'https://placehold.co/400x400.png',
      },
    ],
    adminUids: ["KLcCoN1BwgUaYVtT3i4aX9fJBuH2"],
};
