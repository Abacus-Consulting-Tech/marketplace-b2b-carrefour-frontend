'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { Building2, Store, Users, CreditCard, CheckCircle2 } from 'lucide-react';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const FEATURES = [
  {
    icon: Building2,
    title: 'Register Your Company',
    description: 'Add your company details and legal information',
  },
  {
    icon: Store,
    title: 'Add Store Locations',
    description: 'Configure your stores and delivery addresses',
  },
  {
    icon: Users,
    title: 'Invite Your Team',
    description: 'Add managers, buyers, and team members',
  },
  {
    icon: CreditCard,
    title: 'Choose Your Plan',
    description: 'Select a subscription plan that fits your needs',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const { currentStep, nextStep } = useOnboardingStore();

  const handleGetStarted = () => {
    nextStep();
    router.push('/company');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        {/* Welcome Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Welcome to Carrefour B2B Marketplace
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let&apos;s get your franchisee account set up. This quick setup will take about 5 minutes
                and will help you start ordering from trusted suppliers right away.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* What You'll Need */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                What you&apos;ll need:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Company registration details (CIF/NIF)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Store locations and addresses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Team members&apos; email addresses
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  Payment method for annual subscription
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="px-8"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/marketplace')}
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@carrefour-marketplace.com" className="text-primary hover:underline">
            support@carrefour-marketplace.com
          </a>
        </p>
      </div>
    </div>
  );
}
