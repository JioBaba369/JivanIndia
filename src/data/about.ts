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
  story: `This is where your community's story begins. Write a compelling narrative about your mission, vision, and the journey that brought you here. Explain the problems you solve and the value you bring to the community.\n\nEngage your audience by sharing the passion behind your project. This is your chance to connect with your users on a personal level.`,
  teamMembers: [],
};
