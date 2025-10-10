'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { FraudChallenge } from '@/components/fraud-challenge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Star, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const allChallenges = [
  {
    id: 'phishing-email',
    title: 'Phishing Email',
    scenario: 'From: YourBank Support <support@yourbank-india.com>\nSubject: Urgent: Your Account is Suspended!\n\nDear Customer, we have detected suspicious activity on your account. To re-activate, please click here and verify your details: [link to fake website]',
    isScam: true,
    feedback: 'Correct! Banks never ask for sensitive details via email. The suspicious sender email is a big red flag.',
  },
  {
    id: 'upi-request',
    title: 'UPI Payment Request',
    scenario: 'You receive a UPI payment request for ₹5,000 on your phone with the note: "To receive your OLX payment, please enter your UPI PIN." You were indeed selling an item on OLX.',
    isScam: true,
    feedback: 'Excellent! You never need to enter your UPI PIN to receive money. This is a common scam to trick you into sending money instead.',
  },
  {
    id: 'high-returns',
    title: 'Guaranteed High Returns',
    scenario: 'A message on WhatsApp: "🚀 Double your money in 10 days! 100% guaranteed profit in our new crypto scheme. Limited spots available! Join now!"',
    isScam: true,
    feedback: 'Spot on! Any scheme promising guaranteed high returns, especially in a short time, is almost always a scam. There is no such thing as a risk-free high return.',
  },
  {
    id: 'lottery-scam',
    title: 'Lottery Scam',
    scenario: 'You receive an SMS: "Congratulations! You have won a prize of ₹10,00,000 in our lucky draw. To claim, please pay a processing fee of ₹5,000 to this account..."',
    isScam: true,
    feedback: 'Correct! Legitimate lotteries never ask for a processing fee to claim a prize. This is a classic advance-fee scam.'
  },
  {
    id: 'fake-job',
    title: 'Fake Job Offer',
    scenario: 'You get an email about a job you never applied for: "Dear candidate, we are pleased to offer you a remote data entry position with a salary of ₹40,000/month. To proceed, please deposit a refundable security amount of ₹2,500 for training materials."',
    isScam: true,
    feedback: 'Right! No legitimate company will ask you to pay for a job offer or training materials. This is a scam to take your money.'
  },
  {
    id: 'safe-email',
    title: 'Official Bank Communication',
    scenario: 'From: updates@actualbank.co.in\nSubject: Your Monthly E-Statement\n\nDear Customer, your e-statement for the month is attached. Please use your customer ID to open the password-protected PDF. For any queries, call our official customer care number or visit the nearest branch.',
    isScam: false,
    feedback: 'Correct! This email comes from a legitimate-looking domain, mentions a standard process (password-protected PDF), and directs you to official channels for help without asking for sensitive information directly.',
  }
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}


export default function FraudPreventionPage() {
  const [challenges, setChallenges] = useState<(typeof allChallenges)>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<string[]>([]);

  const refreshChallenges = () => {
    setChallenges(shuffleArray([...allChallenges]));
    setScore(0);
    setStreak(0);
    setAnswered([]);
  };

  useEffect(() => {
    refreshChallenges();
  }, []);

  const handleCorrect = (challengeId: string) => {
    if (answered.includes(challengeId)) return;
    setScore(s => s + 10);
    setStreak(s => s + 1);
    setAnswered(prev => [...prev, challengeId]);
  };

  const handleIncorrect = (challengeId: string) => {
    if (answered.includes(challengeId)) return;
    setStreak(0);
    setAnswered(prev => [...prev, challengeId]);
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Fraud Challenges"
          description="Learn to spot common digital financial scams."
        />
        <Button size="icon" variant="outline" onClick={refreshChallenges}>
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh Challenges</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{score}</div>
            <p className="text-xs text-muted-foreground">Points earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak}</div>
            <p className="text-xs text-muted-foreground">Correct answers in a row</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {challenges.slice(0, 3).map((challenge) => (
          <FraudChallenge
            key={challenge.id}
            {...challenge}
            onCorrect={() => handleCorrect(challenge.id)}
            onIncorrect={() => handleIncorrect(challenge.id)}
            isAnswered={answered.includes(challenge.id)}
          />
        ))}
      </div>
    </main>
  );
}
