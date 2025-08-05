
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from './use-auth';

// Define types directly in the hook
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
}

// Define initial content directly in the hook
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
    ]
};


interface AboutContextType {
  aboutContent: AboutContent;
  isLoading: boolean;
  updateStory: (newStory: string) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  getInitials: (name: string) => string;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const ABOUT_DOC_ID = 'singleton';

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAboutContent);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // To ensure admin checks are against a loaded user

  const getInitials = useCallback((name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);
  
  const aboutDocRef = doc(firestore, 'about', ABOUT_DOC_ID);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docSnap = await getDoc(aboutDocRef);
        if (docSnap.exists()) {
          setAboutContent(docSnap.data() as AboutContent);
        } else {
          // If the document doesn't exist, create it with initial content
          await setDoc(aboutDocRef, initialAboutContent);
          setAboutContent(initialAboutContent);
        }
      } catch (error) {
        console.error("Failed to fetch about content from Firestore", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [aboutDocRef]);

  const updateStory = async (newStory: string) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    const updatedContent = { ...aboutContent, story: newStory };
    setAboutContent(updatedContent);
    await updateDoc(aboutDocRef, { story: newStory });
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
    };
    const updatedMembers = [...aboutContent.teamMembers, newMember];
    setAboutContent({ ...aboutContent, teamMembers: updatedMembers });
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, ...updatedData } 
        : member
    );
    setAboutContent({ ...aboutContent, teamMembers: updatedMembers });
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const deleteTeamMember = async (memberId: string) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    setAboutContent({ ...aboutContent, teamMembers: updatedMembers });
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const value = {
    aboutContent,
    isLoading,
    updateStory,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getInitials,
  };

  return (
    <AboutContext.Provider value={value}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  const context = useContext(AboutContext);
  if (context === undefined) {
    throw new Error('useAbout must be used within an AboutProvider');
  }
  return context;
}
