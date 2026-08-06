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
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore, StoreLocation } from '@/lib/store/onboarding';
import { ArrowLeft, ArrowRight, Plus, Trash2, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const storeSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  province: z.string().min(2, 'Province is required'),
  phone: z.string().min(9, 'Phone number is required'),
});

type StoreFormData = z.infer<typeof storeSchema>;

export default function StoresPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, stores, addStore, removeStore, nextStep, previousStep } = useOnboardingStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  const onAddStore = (data: StoreFormData) => {
    const newStore: StoreLocation = {
      id: Date.now().toString(),
      ...data,
    };
    
    addStore(newStore);
    
    toast({
      title: 'Store added',
      description: `${data.name} has been added to your locations`,
    });

    reset();
    setIsDialogOpen(false);
  };

  const handleRemoveStore = (id: string) => {
    removeStore(id);
    toast({
      title: 'Store removed',
      description: 'The store has been removed from your locations',
    });
  };

  const handleContinue = () => {
    if (stores.length === 0) {
      toast({
        title: 'No stores added',
        description: 'Please add at least one store location',
        variant: 'destructive',
      });
      return;
    }

    nextStep();
    router.push('/users');
  };

  const handleBack = () => {
    previousStep();
    router.push('/company');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        {/* Stores Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Store Locations</CardTitle>
            <CardDescription>
              Add your store locations and delivery addresses. You can add more stores later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Store List */}
            {stores.length > 0 ? (
              <div className="space-y-4">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-start justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{store.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {store.address}, {store.postalCode} {store.city}, {store.province}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          📞 {store.phone}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStore(store.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No stores added yet
                </h3>
                <p className="text-sm text-gray-500">
                  Add your first store location to continue
                </p>
              </div>
            )}

            {/* Add Store Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Store Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Store Location</DialogTitle>
                  <DialogDescription>
                    Enter the details for your store location
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddStore)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Store Name *</Label>
                    <Input
                      id="name"
                      placeholder="Carrefour Express Madrid Centro"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Calle Gran Vía, 45"
                      {...register('address')}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
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

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Store
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

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
                onClick={handleContinue}
                className="sm:ml-auto sm:w-auto"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
