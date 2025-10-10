import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Book, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

const courses = [
  {
    title: 'Financial Basics',
    description: 'Master the fundamentals of money management',
    icon: Book,
    lessonsCompleted: 6,
    totalLessons: 8,
    xp: 400,
    level: 'Beginner',
  },
  {
    title: 'Investment Fundamentals',
    description: 'Learn about stocks, mutual funds, and SIPs',
    icon: TrendingUp,
    lessonsCompleted: 5,
    totalLessons: 12,
    xp: 600,
    level: 'Intermediate',
  },
];

export default function LearnPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
      <PageHeader
        title="Learning Hub"
        description="Build your financial knowledge"
      />

      <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Daily Challenge
            </span>
            <Badge variant="secondary" className="bg-white/20 text-white">2h 15m left</Badge>
          </CardTitle>
          <h3 className="text-xl font-bold">Identify the Phishing Email</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-90">
            Can you spot the red flags in this suspicious email?
          </p>
          <p className="mt-2 font-semibold">+100 XP</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full bg-white text-red-500 hover:bg-white/90">
            Start Challenge
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-4 space-y-4">
          {courses.map((course) => (
            <Card key={course.title}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <course.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {course.lessonsCompleted}/{course.totalLessons} lessons
                  </span>
                  <span>{((course.lessonsCompleted / course.totalLessons) * 100).toFixed(0)}% complete</span>
                </div>
                <Progress value={(course.lessonsCompleted / course.totalLessons) * 100} />
                <p className="text-sm font-medium text-muted-foreground">+{course.xp} XP total</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>No recent activity.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>Achievements coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
