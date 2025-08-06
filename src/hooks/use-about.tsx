
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

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

interface AboutContextType {
  aboutContent: AboutContent | null;
  isLoading: boolean;
  updateStory: (newStory: string) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export function AboutProvider({ children, setAboutContentLoaded }: { children: ReactNode, setAboutContentLoaded: (loaded: boolean) => void }) {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const aboutDocRef = doc(firestore, 'about', 'singleton');

  const fetchAboutContent = useCallback(async () => {
    setIsLoading(true);
    const aboutDocSnap = await getDoc(aboutDocRef);
    if (aboutDocSnap.exists()) {
      setAboutContent(aboutDocSnap.data() as AboutContent);
    } else {
      setAboutContent(null);
    }
    setIsLoading(false);
    setAboutContentLoaded(true);
  }, [aboutDocRef, setAboutContentLoaded]);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  const updateStory = async (newStory: string) => {
    if (!aboutContent) return;
    try {
        await updateDoc(aboutDocRef, { story: newStory });
        setAboutContent(prev => prev ? { ...prev, story: newStory } : null);
    } catch(e) {
        console.error("Error updating story: ", e);
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    if (!aboutContent) return;
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
    };
    const updatedMembers = [...aboutContent.teamMembers, newMember];
    try {
      await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
      setAboutContent(prev => prev ? { ...prev, teamMembers: updatedMembers } : null);
    } catch(e) {
        console.error("Error adding team member: ", e);
    }
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    if (!aboutContent) return;
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { id: member.id, ...updatedData } 
        : member
    );
     try {
        await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
        setAboutContent(prev => prev ? { ...prev, teamMembers: updatedMembers } : null);
    } catch(e) {
        console.error("Error updating team member: ", e);
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    if (!aboutContent) return;
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    try {
        await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
        setAboutContent(prev => prev ? { ...prev, teamMembers: updatedMembers } : null);
    } catch (e) {
        console.error("Error deleting team member: ", e);
    }
  };

  const value = {
    aboutContent,
    isLoading,
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
