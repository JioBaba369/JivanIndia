
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialAboutContent, type AboutContent, type TeamMember } from '@/data/about';

interface AboutContextType {
  aboutContent: AboutContent;
  updateStory: (newStory: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'initials'>) => void;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id' | 'initials'>) => void;
  deleteTeamMember: (memberId: string) => void;
  getInitials: (name: string) => string;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const STORAGE_KEY = 'jivanindia-about-content';

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(initialAboutContent);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setAboutContent(JSON.parse(stored));
            } else {
                setAboutContent(initialAboutContent);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAboutContent));
            }
        } catch (error) {
            console.error("Failed to load about content from localStorage", error);
            setAboutContent(initialAboutContent);
        }
    }
  }, []);

  const persistContent = (updatedContent: AboutContent) => {
      setAboutContent(updatedContent);
      if (typeof window !== 'undefined') {
          try {
              window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
          } catch (error) {
              console.error("Failed to save about content to localStorage", error);
          }
      }
  };
  
  const getInitials = useCallback((name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const updateStory = (newStory: string) => {
    persistContent({ ...aboutContent, story: newStory });
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'initials'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
      initials: getInitials(memberData.name),
    };
    persistContent({ ...aboutContent, teamMembers: [...aboutContent.teamMembers, newMember] });
  };

  const updateTeamMember = (memberId: string, updatedData: Omit<TeamMember, 'id' | 'initials'>) => {
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, ...updatedData, initials: getInitials(updatedData.name) } 
        : member
    );
    persistContent({ ...aboutContent, teamMembers: updatedMembers });
  };

  const deleteTeamMember = (memberId: string) => {
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    persistContent({ ...aboutContent, teamMembers: updatedMembers });
  };

  const value = {
    aboutContent,
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
