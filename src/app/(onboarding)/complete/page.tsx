'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { CheckCircle2, ShoppingCart, Users, Building2, Mail } from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const NEXT_STEPS = [
  {
    icon: ShoppingCart,
    title: 'Browse the Catalog',
    description: 'Explore thousands of products from trusted suppliers',
    action: 'Go to Marketplace',
    href: '/marketplace',
  },
  {
    icon: Users,
    title: 'Invite More Team Members',
    description: 'Add additional team members to your account',
    action: 'Manage Team',
    href: '/settings/team',
  },
  {
    icon: Building2,
    title: 'Manage Your Stores',
    description: 'Add more locations or update existing ones',
    action: 'Manage Stores',
    href: '/settings/stores',
  },
];

export default function CompletePage() {
  const router = useRouter();
  const { 
    currentStep, 
    companyData, 
    stores, 
    teamMembers, 
    completeOnboarding 
  } = useOnboardingStore();

  useEffect(() => {
    // Mark onboarding as complete
    completeOnboarding();
  }, [completeOnboarding]);

  const handleGoToMarketplace = () => {
    router.push('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        {/* Success Card */}
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-12">
            <div className="text-center">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Welcome to Carrefour B2B Marketplace!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Your account has been successfully set up and activated. 
                You&apos;re now ready to start ordering from our network of trusted suppliers.
              </p>

              {/* Summary Stats */}
              <div className="grid sm:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
                  <p className="text-sm text-gray-600">Store{stores.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  <p className="text-sm text-gray-600">Team Member{teamMembers.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                  <p className="text-sm text-gray-600">Subscription</p>
                </div>
              </div>

              {/* Main CTA */}
              <Button
                size="lg"
                onClick={handleGoToMarketplace}
                className="px-8"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            What&apos;s Next?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {NEXT_STEPS.map((step, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(step.href)}
                    className="w-full"
                  >
                    {step.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <Card className="border-0 shadow-md bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Check your inbox
                </h3>
                <p className="text-sm text-gray-600">
                  We&apos;ve sent a confirmation email to{' '}
                  <span className="font-medium">{companyData.email}</span> with your account details
                  and next steps. Invitations have also been sent to your team members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help getting started?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              View our Getting Started Guide
            </a>
            {' '}or{' '}
            <a href="mailto:support@carrefour-marketplace.com" className="text-primary hover:underline font-medium">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
