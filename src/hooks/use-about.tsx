
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection, query, where, getDocs, onSnapshot, writeBatch } from 'firebase/firestore';
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
}

interface AboutContextType {
  aboutContent: AboutContent;
  isLoading: boolean;
  updateAboutContent: (data: Partial<AboutContent>) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'avatarUrl'>) => Promise<void>;
  updateTeamMember: (memberId: string, updatedMember: Omit<TeamMember, 'id' | 'avatarUrl'>) => Promise<void>;
  deleteTeamMember: (memberId: string) => Promise<void>;
  addAdmin: (email: string) => Promise<void>;
  removeAdmin: (uid: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const defaultAboutContent: AboutContent = { 
    story: 'We saw the immense dedication of community leaders, volunteers, and supporters. Yet, we also saw the operational hurdles they faced—fragmented tools, disconnected communication channels, and the constant struggle to engage their communities effectively.\n\nThis platform was created to solve that. We set out to build an all-in-one digital ecosystem where organizations can manage their events, coordinate volunteers, share deals, and communicate seamlessly with their audience. Our goal is to handle the technology so they can focus on what they do best: building community.', 
    teamMembers: [], 
    adminUids: ["defDHmCjCdWvmGid9YYg3RJi01x2", "ZxBLbKfPJNXXCBI99ZbxoYYApTb2"],
};

export function AboutProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const aboutDocRef = doc(firestore, 'about', 'singleton');

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(aboutDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as AboutContent;
          setAboutContent(data);
        } else {
          // If the document doesn't exist, create it with default values.
          setDoc(aboutDocRef, defaultAboutContent).catch(e => console.error("Failed to create default about doc", e));
        }
        setIsLoading(false);
      }, 
      (error) => {
        console.error("Error fetching about content: ", error);
        toast({ title: 'Error', description: 'Could not load site configuration.', variant: 'destructive' });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);
  
  const updateAboutContent = useCallback(async (data: Partial<AboutContent>) => {
    try {
      await updateDoc(aboutDocRef, data);
    } catch (e) {
      console.error("Error updating about content: ", e);
      toast({ title: 'Error', description: 'Could not update site content.', variant: 'destructive' });
      throw e;
    }
  }, [aboutDocRef, toast]);


  const addTeamMember = useCallback(async (memberData: Omit<TeamMember, 'id' | 'avatarUrl'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: new Date().getTime().toString(),
      avatarUrl: '', // Default avatar
    };
    try {
        await updateAboutContent({ teamMembers: arrayUnion(newMember) as any });
    } catch (error) {
        console.error("Error adding team member:", error);
    }
  }, [updateAboutContent]);

  const updateTeamMember = useCallback(async (memberId: string, updatedData: Omit<TeamMember, 'id' | 'avatarUrl'>) => {
    const currentMembers = aboutContent.teamMembers || [];
    const updatedMembers = currentMembers.map(member => 
      member.id === memberId 
        ? { ...member, ...updatedData } 
        : member
    );
    try {
        await updateAboutContent({ teamMembers: updatedMembers });
    } catch (error) {
        console.error("Error updating team member:", error);
    }
  }, [aboutContent.teamMembers, updateAboutContent]);

  const deleteTeamMember = useCallback(async (memberId: string) => {
    const memberToDelete = aboutContent.teamMembers.find(m => m.id === memberId);
    if (memberToDelete) {
        try {
            await updateAboutContent({ teamMembers: arrayRemove(memberToDelete) as any });
        } catch(error) {
             console.error("Error deleting team member:", error);
        }
    }
  }, [aboutContent.teamMembers, updateAboutContent]);

  const addAdmin = useCallback(async (email: string) => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where("email", "==", email));
    
    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast({ title: 'User Not Found', description: `No user found with the email: ${email}`, variant: 'destructive' });
          return;
        }
        
        const userDoc = querySnapshot.docs[0];
        const userToAdd = { id: userDoc.id, ...userDoc.data() } as User;
        
        if (userToAdd.roles?.includes('admin')) {
            toast({ title: 'Already Admin', description: `${email} is already an administrator.`, variant: 'destructive'});
            return;
        }

        const batch = writeBatch(firestore);
        // Add to singleton document
        batch.update(aboutDocRef, { adminUids: arrayUnion(userToAdd.id) });
        // Add to user's roles array
        const userRef = doc(firestore, 'users', userToAdd.id);
        batch.update(userRef, { roles: arrayUnion('admin') });
        
        await batch.commit();
        
        toast({ title: 'Admin Added', description: `${email} has been granted admin privileges.` });
    } catch (e) {
      console.error("Error adding admin: ", e);
      toast({ title: 'Error', description: 'Could not add admin.', variant: 'destructive' });
    }
  }, [aboutDocRef, toast]);

  const removeAdmin = useCallback(async (uid: string) => {
    try {
      const batch = writeBatch(firestore);
      // Remove from singleton document
      batch.update(aboutDocRef, { adminUids: arrayRemove(uid) });
      // Remove from user's roles array
      const userRef = doc(firestore, 'users', uid);
      batch.update(userRef, { roles: arrayRemove('admin') });
      
      await batch.commit();

      toast({ title: 'Admin Removed', description: 'Admin privileges have been revoked.' });
    } catch (e) {
      console.error("Error removing admin: ", e);
      toast({ title: 'Error', description: 'Could not remove admin.', variant: 'destructive' });
    }
  }, [aboutDocRef, toast]);

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
