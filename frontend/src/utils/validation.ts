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

// Form validation helper
export function validateForm<T>(
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
