
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { initialAboutContent, type AboutContent, type TeamMember } from '@/data/about';

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

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAboutContent);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  
  const aboutDocRef = doc(firestore, 'about', ABOUT_DOC_ID);

  useEffect(() => {
    const fetchAndSeedAbout = async () => {
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (aboutDocSnap.exists()) {
            setAboutContent(aboutDocSnap.data() as AboutContent);
        } else {
            await setDoc(aboutDocRef, initialAboutContent);
            setAboutContent(initialAboutContent);
        }
        setIsLoading(false);
    };

    fetchAndSeedAbout();
  }, []);

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
    const newContent = { ...aboutContent, teamMembers: updatedMembers }
    setAboutContent(newContent);
    await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    if (!user?.isAdmin) throw new Error("Unauthorized");
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { id: member.id, ...updatedData } 
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
