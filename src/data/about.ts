
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
  story: ``,
  teamMembers: [],
};
