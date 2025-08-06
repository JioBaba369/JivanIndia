'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

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

const defaultAboutContent: AboutContent = {
    story: `JivanIndia.co began as a simple conversation among friends, new to a country far from home. We missed the vibrant festivals, the familiar flavors, and the easy camaraderie of our communities back in India. We found ourselves constantly searching—for local temples, for the best place to buy spices, for cultural events that felt like a piece of home.

Information was scattered across countless websites, social media groups, and word-of-mouth recommendations. It was a chore to piece everything together. We dreamed of a single, reliable place where the Indian diaspora could connect, share, and thrive. A digital 'jivan'—a source of life and vitality for our community.

That dream became JivanIndia.co.

We started by building a simple calendar of events. As more people joined, we added a directory for community organizations, then a space for local businesses to share deals, and a section for the latest movies from home. It grew organically, fueled by the needs and contributions of people just like us.

Today, JivanIndia.co is more than just a website. It's a bustling hub, a digital town square where traditions are celebrated, connections are forged, and the spirit of India is kept alive, no matter where we are in the world. Our journey is a testament to the power of community, and we invite you to be a part of it.`,
    teamMembers: [],
    adminUids: [],
};


interface AboutContextType {
  aboutContent: AboutContent;
  isLoading: boolean;
  setAboutContent: (content: AboutContent) => void;
  updateStory: (newStory: string) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const ABOUT_DOC_ID = 'singleton';

export function AboutProvider({ children, setAboutContentLoaded }: { children: ReactNode, setAboutContentLoaded: (loaded: boolean) => void }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [isLoading, setIsLoading] = useState(true);
  
  const aboutDocRef = doc(firestore, 'about', ABOUT_DOC_ID);

  useEffect(() => {
    const fetchAndSeedAbout = async () => {
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (aboutDocSnap.exists()) {
            setAboutContent(aboutDocSnap.data() as AboutContent);
        } else {
             await setDoc(aboutDocRef, defaultAboutContent);
             setAboutContent(defaultAboutContent);
        }
        setIsLoading(false);
        setAboutContentLoaded(true);
    };

    fetchAndSeedAbout();
  }, [setAboutContentLoaded]);

  const updateStory = async (newStory: string) => {
    const updatedContent = { ...aboutContent, story: newStory };
    setAboutContent(updatedContent);
    await updateDoc(aboutDocRef, { story: newStory });
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
    };
    const updatedMembers = [...aboutContent.teamMembers, newMember];
    const newContent = { ...aboutContent, teamMembers: updatedMembers }
    setAboutContent(newContent);
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { id: member.id, ...updatedData } 
        : member
    );
    setAboutContent({ ...aboutContent, teamMembers: updatedMembers });
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const deleteTeamMember = async (memberId: string) => {
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    setAboutContent({ ...aboutContent, teamMembers: updatedMembers });
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const value = {
    aboutContent,
    isLoading,
    setAboutContent,
    updateStory,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
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
