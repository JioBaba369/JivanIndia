
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

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
}

interface AboutContextType {
  aboutContent: AboutContent;
  isLoading: boolean;
  updateStory: (newStory: string) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  addAdmin: (email: string) => Promise<void>;
  removeAdmin: (uid: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>({ story: '', teamMembers: [], adminUids: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const aboutDocRef = doc(firestore, 'about', 'singleton');

  const fetchAboutContent = useCallback(async () => {
    setIsLoading(true);
    try {
        const aboutDocSnap = await getDoc(aboutDocRef);
        if (aboutDocSnap.exists()) {
        setAboutContent(aboutDocSnap.data() as AboutContent);
        } else {
        setAboutContent({ story: 'Our story has not been written yet.', teamMembers: [], adminUids: [] });
        }
    } catch (error) {
        console.error("Error fetching about content: ", error);
        setAboutContent({ story: 'Our story has not been written yet.', teamMembers: [], adminUids: [] });
    } finally {
        setIsLoading(false);
    }
  }, [aboutDocRef]);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  const updateStory = async (newStory: string) => {
    try {
      await updateDoc(aboutDocRef, { story: newStory });
      setAboutContent(prev => ({ ...prev, story: newStory }));
      toast({ title: 'Success', description: 'Our Story has been updated.' });
    } catch(e) {
      console.error("Error updating story: ", e);
      toast({ title: 'Error', description: 'Could not update story.', variant: 'destructive' });
    }
  };

  const addTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
    };
    const updatedMembers = [...aboutContent.teamMembers, newMember];
    try {
      await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
      setAboutContent(prev => ({ ...prev, teamMembers: updatedMembers }));
      toast({ title: 'Success', description: 'Team member added.' });
    } catch(e) {
      console.error("Error adding team member: ", e);
      toast({ title: 'Error', description: 'Could not add team member.', variant: 'destructive' });
    }
  };

  const updateTeamMember = async (memberId: string, updatedData: Omit<TeamMember, 'id'>) => {
    const updatedMembers = aboutContent.teamMembers.map(member => 
      member.id === memberId 
        ? { id: member.id, ...updatedData } 
        : member
    );
     try {
        await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
        setAboutContent(prev => ({ ...prev, teamMembers: updatedMembers }));
        toast({ title: 'Success', description: 'Team member updated.' });
    } catch(e) {
        console.error("Error updating team member: ", e);
        toast({ title: 'Error', description: 'Could not update team member.', variant: 'destructive' });
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    const updatedMembers = aboutContent.teamMembers.filter(member => member.id !== memberId);
    try {
        await updateDoc(aboutDocRef, { teamMembers: updatedMembers });
        setAboutContent(prev => ({ ...prev, teamMembers: updatedMembers }));
        toast({ title: 'Success', description: 'Team member removed.' });
    } catch (e) {
        console.error("Error deleting team member: ", e);
        toast({ title: 'Error', description: 'Could not remove team member.', variant: 'destructive' });
    }
  };

  const addAdmin = async (email: string) => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("email", "==", email));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast({ title: 'User Not Found', description: `No user found with the email: ${email}`, variant: 'destructive' });
        return;
      }
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      if (aboutContent.adminUids.includes(userId)) {
          toast({ title: 'Already Admin', description: `${email} is already an administrator.`, variant: 'destructive'});
          return;
      }

      await updateDoc(aboutDocRef, { adminUids: arrayUnion(userId) });
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
      setAboutContent(prev => ({...prev, adminUids: prev.adminUids.filter(id => id !== uid) }));
      toast({ title: 'Admin Removed', description: 'Admin privileges have been revoked.' });
    } catch (e) {
      console.error("Error removing admin: ", e);
      toast({ title: 'Error', description: 'Could not remove admin.', variant: 'destructive' });
    }
  }

  const value = {
    aboutContent,
    isLoading,
    updateStory,
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
