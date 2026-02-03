// REAL validation functions (not fake ones)

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateAgentName(name: string): ValidationResult {
  // TODO: Add more comprehensive validation
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Agent name is required' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Agent name must be at least 3 characters' };
  }
  
  if (trimmed.length > 64) {
    return { isValid: false, error: 'Agent name must be less than 64 characters' };
  }
  
  // Check for valid characters (alphanumeric, spaces, basic punctuation)
  const validNameRegex = /^[a-zA-Z0-9\s\-_\.]+$/;
  if (!validNameRegex.test(trimmed)) {
    return { isValid: false, error: 'Agent name contains invalid characters' };
  }
  
  // TODO: Add uniqueness check once contracts are deployed
  // const exists = await contractService.checkNameExists(trimmed);
  // if (exists) return { isValid: false, error: 'Agent name already taken' };
  
  return { isValid: true };
}

export function validateStakeAmount(amount: string): ValidationResult {
  if (!amount || typeof amount !== 'string') {
    return { isValid: false, error: 'Stake amount is required' };
  }
  
  const numericAmount = parseFloat(amount);
  
  if (isNaN(numericAmount)) {
    return { isValid: false, error: 'Stake amount must be a valid number' };
  }
  
  if (numericAmount < 0.1) {
    return { isValid: false, error: 'Minimum stake amount is 0.1 TON' };
  }
  
  if (numericAmount > 10000) {
    return { isValid: false, error: 'Maximum stake amount is 10,000 TON' };
  }
  
  // Check decimal places (TON has 9 decimal places max)
  const decimalParts = amount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 9) {
    return { isValid: false, error: 'Too many decimal places (max 9)' };
  }
  
  return { isValid: true };
}

export function validateLoanAmount(amount: string, maxEligible: number): ValidationResult {
  const basicValidation = validateStakeAmount(amount);
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  const numericAmount = parseFloat(amount);
  
  if (numericAmount > maxEligible) {
    return { 
      isValid: false, 
      error: `Loan amount exceeds eligibility (max: ${maxEligible.toFixed(2)} TON)` 
    };
  }
  
  return { isValid: true };
}

export function validateProposalTitle(title: string): ValidationResult {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Proposal title is required' };
  }
  
  const trimmed = title.trim();
  
  if (trimmed.length < 10) {
    return { isValid: false, error: 'Proposal title must be at least 10 characters' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Proposal title must be less than 200 characters' };
  }
  
  return { isValid: true };
}

export function validateProposalDescription(description: string): ValidationResult {
  if (!description || typeof description !== 'string') {
    return { isValid: false, error: 'Proposal description is required' };
  }
  
  const trimmed = description.trim();
  
  if (trimmed.length < 50) {
    return { isValid: false, error: 'Proposal description must be at least 50 characters' };
  }
  
  if (trimmed.length > 5000) {
    return { isValid: false, error: 'Proposal description must be less than 5000 characters' };
  }
  
  return { isValid: true };
}

export function validateTONAddress(address: string): ValidationResult {
  // TODO: Implement proper TON address validation
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'TON address is required' };
  }
  
  const trimmed = address.trim();
  
  // Basic format check - TON addresses start with EQ, UQ, or 0:
  const tonAddressRegex = /^(EQ|UQ)[A-Za-z0-9_-]{46}$|^0:[a-fA-F0-9]{64}$/;
  if (!tonAddressRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid TON address format' };
  }
  
  return { isValid: true };
}

// Form validation helper - FIXED TypeScript constraint
export function validateForm<T extends Record<string, any>>(
  data: T, 
  validators: { [K in keyof T]?: (value: T[K]) => ValidationResult }
): { isValid: boolean; errors: { [K in keyof T]?: string } } {
  
  const errors: { [K in keyof T]?: string } = {};
  let isValid = true;
  
  for (const [field, validator] of Object.entries(validators)) {
    if (validator && field in data) {
      const result = validator((data as any)[field]);
      if (!result.isValid) {
        errors[field as keyof T] = result.error;
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
}

// Additional validation functions for better UX
export function validateMetadata(metadata: string): ValidationResult {
  if (!metadata || typeof metadata !== 'string') {
    return { isValid: false, error: 'Agent metadata is required' };
  }

  const trimmed = metadata.trim();

  if (trimmed.length < 20) {
    return { isValid: false, error: 'Agent metadata must be at least 20 characters' };
  }

  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Agent metadata must be less than 1000 characters' };
  }

  // Try to parse as JSON if it looks like JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
    } catch {
      return { isValid: false, error: 'Metadata appears to be JSON but is invalid format' };
    }
  }

  return { isValid: true };
}

export function validateVerificationData(data: string): ValidationResult {
  if (!data || typeof data !== 'string') {
    return { isValid: false, error: 'Verification data is required' };
  }

  const trimmed = data.trim();

  // Basic validation - in reality this would check cryptographic signatures
  if (trimmed.length < 10) {
    return { isValid: false, error: 'Verification data too short' };
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: 'Verification data too long' };
  }

  return { isValid: true };
}

// Better TON address validation (still TODO for full implementation)
export function validateTONAddressAdvanced(address: string): ValidationResult {
  const basicResult = validateTONAddress(address);
  if (!basicResult.isValid) return basicResult;

  // TODO: Add checksum validation
  // TODO: Add network validation (mainnet vs testnet)
  // TODO: Add smart contract detection

  return { isValid: true };
}

export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Basic XSS prevention
    .replace(/\x00/g, ''); // Remove null bytes
}
