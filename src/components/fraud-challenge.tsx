'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type FraudChallengeProps = {
  id: string;
  title: string;
  scenario: string;
  isScam: boolean;
  feedback: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  isAnswered: boolean;
};

export function FraudChallenge({ title, scenario, isScam, feedback, onCorrect, onIncorrect, isAnswered }: FraudChallengeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', message: '' });

  const handleChoice = (userChoseScam: boolean) => {
    if (isAnswered) return;

    if (userChoseScam === isScam) {
      setAlertContent({ title: 'Correct!', message: feedback });
      onCorrect();
    } else {
      const incorrectMessage = isScam
        ? "This was actually a scam. It's designed to trick you. " + feedback
        : "This was a safe message. Look closer next time. " + feedback;
      setAlertContent({ title: 'Incorrect!', message: incorrectMessage });
      onIncorrect();
    }
    setIsOpen(true);
  };

  return (
    <>
      <Card className={cn('flex flex-col', isAnswered && 'bg-muted/50')}>
        <CardHeader>
          <CardTitle className="font-semibold">{title}</CardTitle>
          <CardDescription>Read the scenario and decide if it's a scam.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-foreground bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-code whitespace-pre-wrap">{scenario}</p>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button variant="destructive" onClick={() => handleChoice(true)} disabled={isAnswered}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            It's a Scam
          </Button>
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleChoice(false)} disabled={isAnswered}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Looks Safe
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsOpen(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
