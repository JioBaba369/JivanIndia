
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  label: string;
  description: string;
}

const ChecklistItem = ({ id, label, description }: ChecklistItemProps) => (
  <div className="flex items-start gap-4 rounded-md border p-4 transition-all hover:bg-accent">
    <Checkbox id={id} className="mt-1" />
    <div className="grid gap-1.5 leading-none">
      <Label htmlFor={id} className="text-base font-medium">
        {label}
      </Label>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
);

const checklistData = {
    readiness: [
        { id: 'c1', label: 'Final Data Wipe', description: 'All sample events, communities, users (except initial admin), etc., have been cleared from the database.' },
        { id: 'c2', label: 'Favicon & Branding', description: 'Site logo and favicon are finalized and configured in the admin panel.' },
        { id: 'c3', label: 'Domain & Hosting', description: 'Firebase Hosting is connected to the final production domain (jivanindia.co).' },
    ],
    functionality: [
        { id: 'f1', label: 'User Authentication', description: 'Users can successfully sign up, log in, and log out.' },
        { id: 'f2', label: 'Profile Management', description: 'Users can create, view, and update their public and private profiles.' },
        { id: 'f3', label: 'Community Management', description: 'Users can create, edit, and manage their own community pages.' },
        { id: 'f4', label: 'Content Creation', description: 'Affiliated users can create new events, deals, and job postings.' },
        { id: 'f5', label: 'Save & Join System', description: 'Users can save events/deals and join communities, with changes reflected in their profile.' },
        { id: 'f6', label: 'Reporting System', description: 'Users can report content, and reports appear correctly in the admin dashboard.' },
    ],
    ui: [
        { id: 'u1', label: 'Responsive Design', description: 'All pages are tested and visually correct on desktop, tablet, and mobile screen sizes.' },
        { id: 'u2', label: 'Navigation Consistency', description: 'Header and footer navigation is consistent and links to all correct pages.' },
        { id: 'u3', label: 'Empty State Handling', description: 'All list pages (Events, Deals, etc.) show a user-friendly message when there is no data.' },
        { id: 'u4', label: 'Error Handling', description: 'Application gracefully handles 404 Not Found, general errors, and data loading states.' },
    ],
    content: [
        { id: 'cd1', label: 'Real-time Updates', description: 'Data across the app (events, communities) updates in real-time without page reloads.' },
        { id: 'cd2', label: 'Date & Time Handling', description: 'All dates and times are correctly handled and displayed across different timezones.' },
        { id: 'cd3', label: 'Static Content Review', description: 'All static content (About Us, India, Festivals, Legal pages) is proofread and finalized.' },
    ],
    admin: [
        { id: 'a1', label: 'Content Moderation', description: 'Admins can approve/archive events and verify/feature communities and businesses.' },
        { id: 'a2', label: 'User Management', description: 'Admins can add/remove other platform administrators.' },
        { id: 'a3', label: 'Team Management', description: 'Admins can add, edit, and remove team members displayed on the About Us page.' },
        { id: 'a4', label: 'Report Moderation', description: 'Admins can view and resolve user-submitted reports.' },
    ],
    technical: [
        { id: 't1', label: 'Sitemap Generation', description: 'The sitemap.ts file correctly generates URLs for all static and dynamic pages.' },
        { id: 't2', label: 'Security Rules', description: 'Firestore security rules are in place to protect user data (implicit in Firebase setup).' },
        { id: 't3', label: 'Dependencies', description: 'All package.json dependencies are up-to-date and free of known major vulnerabilities.' },
    ],
};


export default function ChecklistPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <CheckCircle2 className="h-12 w-12 text-primary"/>
          </div>
          <CardTitle className="font-headline text-3xl text-center">Application Launch Checklist</CardTitle>
          <CardDescription className="text-center">
            A final, comprehensive checklist to ensure all features are implemented correctly and the application is ready for a successful launch.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-semibold">Pre-Launch Readiness</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        {checklistData.readiness.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-semibold">Core Functionality</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       {checklistData.functionality.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-semibold">User Experience & UI</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       {checklistData.ui.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-semibold">Content & Data</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       {checklistData.content.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-semibold">Admin & Moderation</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       {checklistData.admin.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="text-xl font-semibold">Technical & Performance</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       {checklistData.technical.map(item => <ChecklistItem key={item.id} {...item} />)}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
