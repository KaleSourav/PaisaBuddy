import { PageHeader } from '@/components/page-header';
import { AdviceForm } from '@/components/advice-form';

export default function AdvicePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:gap-6 lg:p-6">
      <PageHeader
        title="Personalized Financial Advice"
        description="Get tailored recommendations from our AI advisor."
      />
      <div className="flex-1 flex items-start justify-center">
        <AdviceForm />
      </div>
    </main>
  );
}
