import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type LogoProps = {
  className?: string;
};

const RupeeIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 18H17C18.1046 18 19 17.1046 19 16V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 18L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <RupeeIcon />
      </div>
      <h1 className="text-lg font-bold text-foreground">Paisabuddy</h1>
    </div>
  );
}
