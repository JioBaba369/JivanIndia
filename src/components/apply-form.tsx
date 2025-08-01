
'use client';

import { useState, FormEvent, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paperclip } from 'lucide-react';
import { submitApplication } from '@/ai/flows/submit-application-flow';

interface ApplyFormProps {
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyForm({ jobTitle, companyName, isOpen, onOpenChange }: ApplyFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resume) {
        toast({
            title: "Resume Required",
            description: "Please upload your resume to apply.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);

    try {
        const resumeDataUri = await fileToDataUri(resume);
        
        const result = await submitApplication({
            name,
            email,
            jobTitle,
            companyName,
            resumeDataUri,
        });

        onOpenChange(false);
        toast({
            title: "Application Sent!",
            description: result.message,
        });
        
        // Reset form
        setName('');
        setEmail('');
        setResume(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    } catch (error) {
        console.error("Submission failed", error);
        toast({
            title: "Submission Failed",
            description: "There was an error submitting your application. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setResume(e.target.files[0]);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Apply for {jobTitle}</DialogTitle>
            <DialogDescription>
                Submit your application to {companyName}. Good luck!
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Name
                </Label>
                <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3" 
                    required 
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                Email
                </Label>
                <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    required
                />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resume" className="text-right">
                Resume
                </Label>
                <div className='col-span-3'>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="mr-2 h-4 w-4" />
                        {resume ? "Change file" : "Upload Resume"}
                    </Button>
                    <Input 
                        id="resume" 
                        type="file" 
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                    />
                    {resume && <span className="ml-4 text-sm text-muted-foreground truncate">{resume.name}</span>}
                </div>
            </div>
            </div>
            <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isSubmitting}>
                    Cancel
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
