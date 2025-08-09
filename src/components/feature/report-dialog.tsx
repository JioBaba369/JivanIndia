
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useReports, type NewReportInput } from '@/hooks/use-reports';
import { useToast } from '@/hooks/use-toast';
import { Flag, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ReportDialogProps {
  contentId: string;
  contentType: NewReportInput['contentType'];
  contentTitle: string;
  triggerComponent?: React.ReactElement;
  triggerVariant?: 'ghost' | 'outline' | 'default';
}

export default function ReportDialog({ 
  contentId, 
  contentType, 
  contentTitle, 
  triggerVariant = 'ghost',
  triggerComponent,
}: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { addReport } = useReports();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: 'Please Log In', description: 'You must be logged in to report content.', variant: 'destructive' });
      router.push('/login');
      return;
    }
    if (reason.length < 10) {
      toast({ title: 'Reason Required', description: 'Please provide a reason of at least 10 characters.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReport({
        contentId,
        contentType,
        contentTitle,
        contentLink: window.location.href,
        reason,
        reportedByUid: user.uid,
      });
      toast({
        title: 'Report Submitted',
        description: 'Thank you for your feedback. Our team will review it shortly.',
      });
      setIsOpen(false);
      setReason('');
    } catch (error) {
      console.error('Failed to submit report', error);
      toast({ title: 'Error', description: 'Failed to submit report. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const Trigger = triggerComponent ? (
    <div onClick={() => setIsOpen(true)} className="w-full">
      {triggerComponent}
    </div>
  ) : (
    <Button variant={triggerVariant} size="sm">
      <Flag className="mr-2 h-4 w-4" />
      Report
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {Trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. If you believe this content violates our guidelines, please let us know.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div>
                <p className="text-sm font-medium">Content being reported:</p>
                <p className="text-sm text-muted-foreground font-semibold">{`[${contentType}] ${contentTitle}`}</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="reason">Reason for reporting</Label>
                <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your report..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
