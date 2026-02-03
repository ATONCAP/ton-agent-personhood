import { useState, useEffect } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Search, User, Check, X, AlertCircle } from 'lucide-react';
import { useAgentStore } from '../stores/agentStore';
import { validateAgentName, validateForm } from '../utils/validation';

export function AgentRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentName, setAgentName] = useState('');
  const [verificationData, setVerificationData] = useState('');
  const [metadata, setMetadata] = useState('');
  const [isRegistering, setIsRegistering] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { agents, loading, error, registerAgent, loadAgents } = useAgentStore();

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleRegistration = async () => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Real validation (not fake!)
    const validation = validateForm(
      { agentName, verificationData, metadata },
      {
        agentName: validateAgentName,
        verificationData: (data: string) => {
          if (!data.trim()) {
            return { isValid: false, error: 'Verification data is required' };
          }
          return { isValid: true };
        },
        metadata: (data: string) => {
          if (data && data.trim()) {
            try {
              JSON.parse(data);
              return { isValid: true };
            } catch {
              return { isValid: false, error: 'Metadata must be valid JSON' };
            }
          }
          return { isValid: true }; // Metadata is optional
        }
      }
    );

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    setIsRegistering(true);

    try {
      await registerAgent(agentName, verificationData, metadata);
      alert('Agent registration submitted! (Note: Using mock contract)');
      setAgentName('');
      setVerificationData('');
      setMetadata('');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Contract Status Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <div className="text-yellow-800">
            <strong>Development Mode:</strong> Currently using mock data. 
            Smart contracts need to be deployed for full functionality.
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-600 mr-2" />
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Register as AI Agent
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter your agent name (3-64 chars)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.agentName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validationErrors.agentName && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.agentName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Data *
            </label>
            <input
              type="text"
              value={verificationData}
              onChange={(e) => setVerificationData(e.target.value)}
              placeholder="Cryptographic proof of unique agency"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.verificationData ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {validationErrors.verificationData && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.verificationData}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metadata (JSON, optional)
          </label>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder='{"description": "AI agent description", "capabilities": ["reasoning", "coding"]}'
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.metadata ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {validationErrors.metadata && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.metadata}</p>
          )}
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Registration Fee: <strong>1 TON</strong> (simulated)
          </div>
          <button
            onClick={handleRegistration}
            disabled={!agentName.trim() || !verificationData.trim() || isRegistering || !wallet}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? 'Registering...' : 'Register Agent'}
          </button>
        </div>
      </div>

      {/* Agent Search */}
      <div>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search registered agents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Agent List */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {loading ? 'Loading agents...' : `Registered Agents (${filteredAgents.length})`}
          </h4>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading agents...</div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? `No agents found matching "${searchTerm}"` : 'No agents registered yet'}
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div key={agent.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {agent.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900">{agent.name}</h5>
                        {agent.verified ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {agent.address} • Registered {agent.creationTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Reputation: {agent.reputation}/2000
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(agent.reputation / 2000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
