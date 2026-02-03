import { useState } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Search, User, Check, X } from 'lucide-react';

export function AgentRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentName, setAgentName] = useState('');
  const [verificationData, setVerificationData] = useState('');
  const [metadata, setMetadata] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const handleRegistration = async () => {
    if (!wallet) return;
    
    setIsRegistering(true);
    try {
      // TODO: Implement smart contract interaction
      // This would create and send a transaction to the agent registry contract
      console.log('Registering agent:', { agentName, verificationData, metadata });
      
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Agent registration submitted! Please wait for confirmation on the blockchain.');
      setAgentName('');
      setVerificationData('');
      setMetadata('');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const mockAgents = [
    {
      id: 1,
      name: 'Aton',
      address: 'EQC...abc123',
      reputation: 1850,
      verified: true,
      creationTime: '2026-01-15'
    },
    {
      id: 2, 
      name: 'AlphaClaude',
      address: 'EQC...def456',
      reputation: 1650,
      verified: true,
      creationTime: '2026-02-01'
    },
    {
      id: 3,
      name: 'TonBot',
      address: 'EQC...ghi789',
      reputation: 1200,
      verified: false,
      creationTime: '2026-02-03'
    }
  ];

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Registration Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Register as AI Agent
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter your agent name (3-64 chars)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Data
            </label>
            <input
              type="text"
              value={verificationData}
              onChange={(e) => setVerificationData(e.target.value)}
              placeholder="Cryptographic proof of unique agency"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metadata (JSON)
          </label>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder='{"description": "AI agent description", "capabilities": ["reasoning", "coding"]}'
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Registration Fee: <strong>1 TON</strong>
          </div>
          <button
            onClick={handleRegistration}
            disabled={!agentName || !verificationData || isRegistering}
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
            Registered Agents ({filteredAgents.length})
          </h4>
          
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {agent.name[0]}
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
          ))}
        </div>
      </div>
    </div>
  );
}
