
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
  story: `JivanIndia.co started with a simple yet powerful vision: to create a digital space where the vibrant and diverse Indian community can come together. We noticed that while there were many local groups and resources, there wasn't one central place to discover everything that was happening. Information about cultural events, local businesses, community organizations, and professional opportunities was scattered across social media, forums, and word-of-mouth.

We wanted to change that.

Our journey began with a small team of passionate individuals who wanted to bridge this gap. We envisioned a platform that was more than just a directory; we wanted to build a true community hub. A place where you could find a Navratri celebration, connect with a local non-profit, get a great deal from a neighborhood restaurant, and find career opportunities all in one place.

We are dedicated to fostering connection, celebrating our rich heritage, and creating opportunities for everyone in the Indian diaspora. This platform is built by the community, for the community, and we are just getting started.`,
  teamMembers: [
    {
      id: '1',
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      avatarUrl: 'https://unsplash.com/photos/a-cat-peeks-out-from-inside-a-container-g5o6T-PWT3g 0',
      initials: 'PS',
      bio: 'Priya is passionate about building bridges within the community. Her vision is to create a platform that empowers and connects every member of the Indian diaspora.',
    },
    {
      id: '2',
      name: 'Bibin Jose',
      role: 'Founder & CEO ',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      initials: 'RM',
      bio: 'Rohan is the technical architect behind JivanIndia.co. He loves solving complex problems and building user-friendly digital experiences.',
    },
  ],
};
