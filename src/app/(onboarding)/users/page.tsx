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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { useOnboardingStore, TeamMember } from '@/lib/store/onboarding';
import { ArrowLeft, ArrowRight, Plus, Trash2, UserPlus, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Welcome', description: 'Get started' },
  { id: 2, name: 'Company', description: 'Company details' },
  { id: 3, name: 'Stores', description: 'Add locations' },
  { id: 4, name: 'Team', description: 'Invite members' },
  { id: 5, name: 'Payment', description: 'Subscription' },
  { id: 6, name: 'Complete', description: 'All done!' },
];

const teamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['manager', 'buyer', 'viewer'], {
    required_error: 'Please select a role',
  }),
  storeId: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

const ROLE_LABELS = {
  manager: 'Manager',
  buyer: 'Buyer',
  viewer: 'Viewer',
};

const ROLE_COLORS = {
  manager: 'bg-purple-100 text-purple-800',
  buyer: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
};

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStep, stores, teamMembers, addTeamMember, removeTeamMember, nextStep, previousStep } = useOnboardingStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'manager' | 'buyer' | 'viewer'>('buyer');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
  });

  const onAddTeamMember = (data: TeamMemberFormData) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...data,
      role: selectedRole,
    };
    
    addTeamMember(newMember);
    
    toast({
      title: 'Team member invited',
      description: `${data.firstName} ${data.lastName} will receive an invitation email`,
    });

    reset();
    setSelectedRole('buyer');
    setIsDialogOpen(false);
  };

  const handleRemoveTeamMember = (id: string) => {
    removeTeamMember(id);
    toast({
      title: 'Team member removed',
      description: 'The team member has been removed',
    });
  };

  const handleContinue = () => {
    // Team members are optional, so we can continue even with 0
    nextStep();
    router.push('/payment');
  };

  const handleBack = () => {
    previousStep();
    router.push('/stores');
  };

  const getStoreName = (storeId?: string) => {
    if (!storeId) return null;
    const store = stores.find(s => s.id === storeId);
    return store?.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
        </div>

        {/* Team Members Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Invite Team Members</CardTitle>
            <CardDescription>
              Add your team members and assign them roles. They will receive an invitation email to join your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Descriptions */}
            <div className="grid sm:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Manager</h4>
                <p className="text-xs text-gray-600">Full access to manage orders and team</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Buyer</h4>
                <p className="text-xs text-gray-600">Can browse and place orders</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Viewer</h4>
                <p className="text-xs text-gray-600">Read-only access to view orders</p>
              </div>
            </div>

            {/* Team Members List */}
            {teamMembers.length > 0 ? (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <UserPlus className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {member.firstName} {member.lastName}
                          </h3>
                          <Badge className={ROLE_COLORS[member.role]}>
                            {ROLE_LABELS[member.role]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </p>
                          {member.storeId && (
                            <p className="text-sm text-gray-500">
                              📍 {getStoreName(member.storeId)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTeamMember(member.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No team members added yet
                </h3>
                <p className="text-sm text-gray-500">
                  Add team members or skip this step and add them later
                </p>
              </div>
            )}

            {/* Add Team Member Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Enter the details for the team member you want to invite
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddTeamMember)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Juan"
                        {...register('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="García"
                        {...register('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan.garcia@company.com"
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value) => {
                        setSelectedRole(value as 'manager' | 'buyer' | 'viewer');
                        setValue('role', value as 'manager' | 'buyer' | 'viewer');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager - Full access</SelectItem>
                        <SelectItem value="buyer">Buyer - Can place orders</SelectItem>
                        <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-500">{errors.role.message}</p>
                    )}
                  </div>

                  {stores.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="storeId">Assign to Store (Optional)</Label>
                      <Select
                        onValueChange={(value) => setValue('storeId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a store" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={store.id}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Send Invitation
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
