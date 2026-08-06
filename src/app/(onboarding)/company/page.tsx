'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const companySchema = z.object({
  cif: z.string().min(9, 'CIF must be at least 9 characters').max(9, 'CIF must be exactly 9 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  legalName: z.string().min(2, 'Legal name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  province: z.string().min(2, 'Province is required'),
  country: z.string().default('Spain'),
  phone: z.string().min(9, 'Phone number must be at least 9 digits'),
  email: z.string().email('Invalid email address'),
});

type CompanyFormData = z.infer<typeof companySchema>;

export default function CompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, companyData, setCompanyData, nextStep, previousStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      cif: companyData.cif || '',
      companyName: companyData.companyName || '',
      legalName: companyData.legalName || '',
      address: companyData.address || '',
      city: companyData.city || '',
      postalCode: companyData.postalCode || '',
      province: companyData.province || '',
      country: companyData.country || 'Spain',
      phone: companyData.phone || '',
      email: companyData.email || '',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Save to store
      setCompanyData(data);
      
      toast({
        title: 'Company details saved',
        description: 'Moving to next step...',
      });

      // Move to next step
      nextStep();
      router.push('/stores');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company details',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    previousStep();
    router.push('/welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        {/* Company Form Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Enter your company&apos;s legal and contact information. This will be used for billing and verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* CIF */}
              <div className="space-y-2">
                <Label htmlFor="cif">CIF/NIF *</Label>
                <Input
                  id="cif"
                  placeholder="A12345678"
                  {...register('cif')}
                  className={errors.cif ? 'border-red-500' : ''}
                />
                {errors.cif && (
                  <p className="text-sm text-red-500">{errors.cif.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Carrefour Franchisee S.L."
                  {...register('companyName')}
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              {/* Legal Name */}
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name *</Label>
                <Input
                  id="legalName"
                  placeholder="Carrefour Franchisee Sociedad Limitada"
                  {...register('legalName')}
                  className={errors.legalName ? 'border-red-500' : ''}
                />
                {errors.legalName && (
                  <p className="text-sm text-red-500">{errors.legalName.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Calle Principal, 123"
                  {...register('address')}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              {/* City, Postal Code, Province */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Madrid"
                    {...register('city')}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="28001"
                    {...register('postalCode')}
                    className={errors.postalCode ? 'border-red-500' : ''}
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Input
                    id="province"
                    placeholder="Madrid"
                    {...register('province')}
                    className={errors.province ? 'border-red-500' : ''}
                  />
                  {errors.province && (
                    <p className="text-sm text-red-500">{errors.province.message}</p>
                  )}
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register('country')}
                  className={errors.country ? 'border-red-500' : ''}
                  disabled
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+34 912 345 678"
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Company Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@company.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="sm:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:ml-auto sm:w-auto"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
