'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardAnalyticsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the external URL when the component mounts
    window.location.href = 'https://6000-firebase-studio-1759997140882.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev/';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <p className="text-lg">Redirecting to external dashboard...</p>
    </div>
  );
}
