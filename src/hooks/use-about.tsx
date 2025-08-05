
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { initialAboutContent, type AboutContent, type TeamMember } from '@/data/about';
import { useAuth } from './use-auth';

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
