// REAL tests for validation functions - no mocks!

import { 
  validateAgentName, 
  validateStakeAmount, 
  validateTONAddress, 
  validateMetadata,
  validateForm 
} from '../../frontend/src/utils/validation';

describe('Validation Functions', () => {
  describe('validateAgentName', () => {
    it('should accept valid agent names', () => {
      expect(validateAgentName('AlphaBot')).toEqual({ isValid: true });
      expect(validateAgentName('My Agent 123')).toEqual({ isValid: true });
      expect(validateAgentName('Agent_With-Dots.And_Dashes')).toEqual({ isValid: true });
    });

    it('should reject empty or invalid names', () => {
      expect(validateAgentName('')).toEqual({ 
        isValid: false, 
        error: 'Agent name is required' 
      });
      expect(validateAgentName('ab')).toEqual({ 
        isValid: false, 
        error: 'Agent name must be at least 3 characters' 
      });
      expect(validateAgentName('a'.repeat(65))).toEqual({ 
        isValid: false, 
        error: 'Agent name must be less than 64 characters' 
      });
      expect(validateAgentName('Invalid@#$')).toEqual({ 
        isValid: false, 
        error: 'Agent name contains invalid characters' 
      });
    });
  });

  describe('validateStakeAmount', () => {
    it('should accept valid stake amounts', () => {
      expect(validateStakeAmount('1.5')).toEqual({ isValid: true });
      expect(validateStakeAmount('100')).toEqual({ isValid: true });
      expect(validateStakeAmount('0.1')).toEqual({ isValid: true });
    });

    it('should reject invalid amounts', () => {
      expect(validateStakeAmount('')).toEqual({ 
        isValid: false, 
        error: 'Stake amount is required' 
      });
      expect(validateStakeAmount('not_a_number')).toEqual({ 
        isValid: false, 
        error: 'Stake amount must be a valid number' 
      });
      expect(validateStakeAmount('0.05')).toEqual({ 
        isValid: false, 
        error: 'Minimum stake amount is 0.1 TON' 
      });
      expect(validateStakeAmount('10001')).toEqual({ 
        isValid: false, 
        error: 'Maximum stake amount is 10,000 TON' 
      });
    });

    it('should handle decimal precision correctly', () => {
      expect(validateStakeAmount('1.123456789')).toEqual({ isValid: true });
      expect(validateStakeAmount('1.1234567890')).toEqual({ 
        isValid: false, 
        error: 'Too many decimal places (max 9)' 
      });
    });
  });

  describe('validateTONAddress', () => {
    it('should accept valid TON address formats', () => {
      // Mock valid addresses for testing
      expect(validateTONAddress('EQ' + 'A'.repeat(46))).toEqual({ isValid: true });
      expect(validateTONAddress('UQ' + 'a'.repeat(46))).toEqual({ isValid: true });
      expect(validateTONAddress('0:' + 'a'.repeat(64))).toEqual({ isValid: true });
    });

    it('should reject invalid addresses', () => {
      expect(validateTONAddress('')).toEqual({ 
        isValid: false, 
        error: 'TON address is required' 
      });
      expect(validateTONAddress('invalid')).toEqual({ 
        isValid: false, 
        error: 'Invalid TON address format' 
      });
      expect(validateTONAddress('EQ' + 'A'.repeat(45))).toEqual({ 
        isValid: false, 
        error: 'Invalid TON address format' 
      });
    });
  });

  describe('validateMetadata', () => {
    it('should accept valid metadata', () => {
      expect(validateMetadata('This is valid metadata content')).toEqual({ isValid: true });
      expect(validateMetadata('{"type": "bot", "capabilities": ["trading"]}')).toEqual({ isValid: true });
    });

    it('should reject invalid metadata', () => {
      expect(validateMetadata('')).toEqual({ 
        isValid: false, 
        error: 'Agent metadata is required' 
      });
      expect(validateMetadata('short')).toEqual({ 
        isValid: false, 
        error: 'Agent metadata must be at least 20 characters' 
      });
      expect(validateMetadata('a'.repeat(1001))).toEqual({ 
        isValid: false, 
        error: 'Agent metadata must be less than 1000 characters' 
      });
      // Test malformed JSON with sufficient length
      expect(validateMetadata('{"this is invalid JSON syntax and long enough": invalid}')).toEqual({ 
        isValid: false, 
        error: 'Metadata appears to be JSON but is invalid format' 
      });
    });
  });

  describe('validateForm', () => {
    it('should validate multiple fields correctly', () => {
      const data = {
        name: 'ValidBot',
        amount: '1.5',
        address: 'EQ' + 'A'.repeat(46)
      };

      const validators = {
        name: validateAgentName,
        amount: validateStakeAmount,
        address: validateTONAddress
      };

      const result = validateForm(data, validators);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should return errors for invalid fields', () => {
      const data = {
        name: 'ab', // too short
        amount: 'invalid', // not a number
        address: 'invalid' // bad format
      };

      const validators = {
        name: validateAgentName,
        amount: validateStakeAmount,
        address: validateTONAddress
      };

      const result = validateForm(data, validators);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.amount).toBeDefined();
      expect(result.errors.address).toBeDefined();
    });
  });
});
