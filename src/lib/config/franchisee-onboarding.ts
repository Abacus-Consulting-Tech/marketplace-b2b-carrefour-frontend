function getFlag(envVarName: string, defaultValue = false): boolean {
  const envValue = process.env[envVarName];

  if (envValue === 'true') {
    return true;
  }

  if (envValue === 'false') {
    return false;
  }

  return defaultValue;
}

export const shouldUseMockFranchiseeInvitations = getFlag(
  'NEXT_PUBLIC_MOCK_FRANCHISEE_INVITATIONS',
  false
);

export const shouldUseMockFranchiseeRegistration = getFlag(
  'NEXT_PUBLIC_MOCK_FRANCHISEE_REGISTRATION',
  false
);