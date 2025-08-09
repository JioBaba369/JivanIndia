
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import type { User } from './use-auth';

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
  adminUids: string[];
  logoUrl?: string;
  faviconUrl?: string;
}

interface AboutContextType {
  aboutContent: AboutContent;
  isLoading: boolean;
  updateAboutContent: (data: Partial<AboutContent>) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  addAdmin: (email: string) => Promise<void>;
  removeAdmin: (uid: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>({ 
    story: 'We saw the immense dedication of community leaders, volunteers, and supporters. Yet, we also saw the operational hurdles they faced—fragmented tools, disconnected communication channels, and the constant struggle to engage their communities effectively.\n\nThis platform was created to solve that. We set out to build an all-in-one digital ecosystem where organizations can manage their events, coordinate volunteers, share deals, and communicate seamlessly with their audience. Our goal is to handle the technology so they can focus on what they do best: building community.', 
    teamMembers: [], 
    adminUids: ["defDHmCjCdWvmGid9YYg3RJi01x2"],
    logoUrl: '',
    faviconUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const aboutDocRef = doc(firestore, 'about', 'singleton');

  const fetchAboutContent = useCallback(async () => {
    setIsLoading(true);
    try {
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (aboutDocSnap.exists()) {
          const data = aboutDocSnap.data() as AboutContent;
          setAboutContent(data);
        } else {
          // If the document doesn't exist, create it with default values.
          await setDoc(aboutDocRef, aboutContent);
        }
    } catch (error) {
        console.error("Error fetching about content: ", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);
  
  const updateAboutContent = async (data: Partial<AboutContent>) => {
    try {
      await updateDoc(aboutDocRef, data);
      setAboutContent(prev => ({ ...prev, ...data }));
    } catch (e) {
      console.error("Error updating about content: ", e);
      toast({ title: 'Error', description: 'Could not update site content.', variant: 'destructive' });
    }
  }


  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
    };
    const updatedMembers = [...aboutContent.teamMembers, newMember];
    await updateAboutContent({ teamMembers: updatedMembers });
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { id: member.id, ...updatedData } 
        : member
    );
    await updateAboutContent({ teamMembers: updatedMembers });
  };

  const deleteTeamMember = async (memberId: string) => {
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    await updateAboutContent({ teamMembers: updatedMembers });
  };

  const addAdmin = async (email: string) => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast({ title: 'User Not Found', description: `No user found with the email: ${email}`, variant: 'destructive' });
      return;
    }
    
    const userToAdd = querySnapshot.docs[0];
    const userId = userToAdd.id;

    if (aboutContent.adminUids.includes(userId)) {
        toast({ title: 'Already Admin', description: `${email} is already an administrator.`, variant: 'destructive'});
        return;
    }

    try {
      await updateDoc(aboutDocRef, { adminUids: arrayUnion(userId) });
      // The user's roles will update on next login, but we can update our local state
      setAboutContent(prev => ({ ...prev, adminUids: [...prev.adminUids, userId] }));
      toast({ title: 'Admin Added', description: `${email} has been granted admin privileges.` });

    } catch (e) {
      console.error("Error adding admin: ", e);
      toast({ title: 'Error', description: 'Could not add admin.', variant: 'destructive' });
    }
  }

  const removeAdmin = async (uid: string) => {
    try {
      await updateDoc(aboutDocRef, { adminUids: arrayRemove(uid) });
      setAboutContent(prev => ({ ...prev, adminUids: prev.adminUids.filter(id => id !== uid) }));
      toast({ title: 'Admin Removed', description: 'Admin privileges have been revoked.' });
    } catch (e) {
      console.error("Error removing admin: ", e);
      toast({ title: 'Error', description: 'Could not remove admin.', variant: 'destructive' });
    }
  }

  const value = {
    aboutContent,
    isLoading,
    updateAboutContent,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addAdmin,
    removeAdmin,
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
