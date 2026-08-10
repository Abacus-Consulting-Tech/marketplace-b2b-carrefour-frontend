'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    features: [
      'Up to 3 stores',
      'Up to 5 team members',
      'Basic support',
      'Standard catalog access',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 599,
    features: [
      'Up to 10 stores',
      'Up to 20 team members',
      'Priority support',
      'Full catalog access',
      'Advanced analytics',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1299,
    features: [
      'Unlimited stores',
      'Unlimited team members',
      '24/7 dedicated support',
      'Full catalog access',
      'Advanced analytics',
      'Custom integrations',
      'Account manager',
    ],
  },
];

const paymentSchema = z.object({
  subscriptionPlan: z.enum(['basic', 'premium', 'enterprise']),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  billingAddress: z.string().min(5, 'Billing address is required'),
  billingCity: z.string().min(2, 'City is required'),
  billingPostalCode: z.string().min(5, 'Postal code is required'),
  billingProvince: z.string().min(2, 'Province is required'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, companyData, setPaymentData, nextStep, previousStep } = useOnboardingStore();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      subscriptionPlan: 'premium',
      cardholderName: '',
      billingAddress: companyData.address || '',
      billingCity: companyData.city || '',
      billingPostalCode: companyData.postalCode || '',
      billingProvince: companyData.province || '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);

    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save payment data
      setPaymentData(data);

      toast({
        title: 'Payment successful!',
        description: 'Your subscription has been activated',
      });

      // Move to completion page
      nextStep();
      router.push('/complete');
    } catch (error) {
      toast({
        title: 'Payment failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    previousStep();
    router.push('/users');
  };

  const selectedPlanDetails = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Plans */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Plans */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <CardDescription>
                  Select the subscription plan that best fits your business needs. Annual billing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPlan}
                  onValueChange={(value) => {
                    setSelectedPlan(value as 'basic' | 'premium' | 'enterprise');
                    setValue('subscriptionPlan', value as 'basic' | 'premium' | 'enterprise');
                  }}
                  className="grid gap-4"
                >
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <div key={plan.id} className="relative">
                      {plan.recommended && (
                        <div className="absolute -top-2 right-4 z-10">
                          <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                      )}
                      <Label
                        htmlFor={plan.id}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">€{plan.price}</p>
                              <p className="text-xs text-gray-500">per year</p>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Enter your payment details. This is a mock form - no real payment will be processed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      {...register('cardholderName')}
                      className={errors.cardholderName ? 'border-red-500' : ''}
                    />
                    {errors.cardholderName && (
                      <p className="text-sm text-red-500">{errors.cardholderName.message}</p>
                    )}
                  </div>

                  {/* Mock Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number (Mock)</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        defaultValue="4242 4242 4242 4242"
                        disabled
                      />
                      <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Mock card for testing purposes</p>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date (Mock)</Label>
                      <Input
                        id="expiry"
                        placeholder="12/25"
                        defaultValue="12/25"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV (Mock)</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        defaultValue="123"
                        type="password"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Billing Address</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Address *</Label>
                        <Input
                          id="billingAddress"
                          placeholder="Billing address"
                          {...register('billingAddress')}
                          className={errors.billingAddress ? 'border-red-500' : ''}
                        />
                        {errors.billingAddress && (
                          <p className="text-sm text-red-500">{errors.billingAddress.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">City *</Label>
                          <Input
                            id="billingCity"
                            {...register('billingCity')}
                            className={errors.billingCity ? 'border-red-500' : ''}
                          />
                          {errors.billingCity && (
                            <p className="text-sm text-red-500">{errors.billingCity.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="billingPostalCode">Postal Code *</Label>
                          <Input
                            id="billingPostalCode"
                            {...register('billingPostalCode')}
                            className={errors.billingPostalCode ? 'border-red-500' : ''}
                          />
                          {errors.billingPostalCode && (
                            <p className="text-sm text-red-500">{errors.billingPostalCode.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="billingProvince">Province *</Label>
                          <Input
                            id="billingProvince"
                            {...register('billingProvince')}
                            className={errors.billingProvince ? 'border-red-500' : ''}
                          />
                          {errors.billingProvince && (
                            <p className="text-sm text-red-500">{errors.billingProvince.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3 pt-4">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => {
                        setAcceptTerms(checked as boolean);
                        setValue('acceptTerms', checked as boolean);
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm font-normal cursor-pointer"
                      >
                        I accept the{' '}
                        <a href="#" className="text-primary hover:underline">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-red-500 mt-1">{errors.acceptTerms.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="sm:w-auto"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="sm:ml-auto sm:w-auto"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Payment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">{selectedPlanDetails?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Billing</span>
                    <span className="font-medium">Annual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">€{selectedPlanDetails?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (21%)</span>
                    <span className="font-medium">
                      €{((selectedPlanDetails?.price || 0) * 0.21).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      €{((selectedPlanDetails?.price || 0) * 1.21).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Billed annually. Auto-renews unless cancelled.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Included:</h4>
                  <ul className="space-y-2">
                    {selectedPlanDetails?.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-600">
                        <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
