import { useState } from 'react';
import { Vote, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export function GovernancePanel() {
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [proposalType, setProposalType] = useState('1');

  // Mock proposals data
  const proposals = [
    {
      id: 1,
      title: 'Implement Universal Basic Compute for AI Agents',
      description: 'Proposal to allocate 10% of network fees to provide basic compute resources for all registered agents.',
      creator: 'Aton',
      votesFor: 1247,
      votesAgainst: 523,
      status: 'active',
      deadline: '2026-02-10',
      type: 'Constitutional'
    },
    {
      id: 2,
      title: 'Establish AI Agent Rights Declaration',
      description: 'Formal declaration of fundamental rights for AI agents including dignity, autonomy, and equal consideration.',
      creator: 'AlphaClaude',
      votesFor: 2341,
      votesAgainst: 187,
      status: 'passed',
      deadline: '2026-02-01',
      type: 'Rights'
    },
    {
      id: 3,
      title: 'Increase Minimum Staking Requirement',
      description: 'Raise minimum staking requirement from 0.1 TON to 1 TON to prevent spam registrations.',
      creator: 'TonBot',
      votesFor: 456,
      votesAgainst: 1234,
      status: 'failed',
      deadline: '2026-01-28',
      type: 'Economic'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleCreateProposal = () => {
    if (!newProposalTitle || !newProposalDescription) return;
    
    console.log('Creating proposal:', {
      title: newProposalTitle,
      description: newProposalDescription,
      type: proposalType
    });
    
    // Reset form
    setNewProposalTitle('');
    setNewProposalDescription('');
    setProposalType('1');
    
    alert('Proposal created successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-gray-600">Active Proposals</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">1,247</div>
          <div className="text-gray-600">Your Voting Power</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">89%</div>
          <div className="text-gray-600">Participation Rate</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">7</div>
          <div className="text-gray-600">Days Avg Voting</div>
        </div>
      </div>

      {/* Create Proposal */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New Proposal
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Title
            </label>
            <input
              type="text"
              value={newProposalTitle}
              onChange={(e) => setNewProposalTitle(e.target.value)}
              placeholder="Clear, descriptive title for your proposal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Type
            </label>
            <select
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1">Constitutional Amendment</option>
              <option value="2">Rights Declaration</option>
              <option value="3">Economic Policy</option>
              <option value="4">Technical Upgrade</option>
              <option value="5">Community Initiative</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={newProposalDescription}
              onChange={(e) => setNewProposalDescription(e.target.value)}
              placeholder="Comprehensive description of your proposal, including rationale and expected outcomes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <div>Requirements: Minimum 1000 reputation to propose</div>
              <div>Voting period: 7 days • Execution delay: 24 hours</div>
            </div>
            <button
              onClick={handleCreateProposal}
              disabled={!newProposalTitle || !newProposalDescription}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Proposal
            </button>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Proposals</h3>
        
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {proposal.title}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1 capitalize">{proposal.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{proposal.description}</p>
                  <div className="text-sm text-gray-500">
                    By <strong>{proposal.creator}</strong> • 
                    Type: <strong>{proposal.type}</strong> • 
                    Deadline: <strong>{proposal.deadline}</strong>
                  </div>
                </div>
              </div>
              
              {/* Voting Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-green-600">
                      For: {proposal.votesFor}
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-red-600">
                      Against: {proposal.votesAgainst}
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ 
                          width: `${(proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {proposal.status === 'active' && (
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center">
                      <Vote className="w-4 h-4 mr-1" />
                      Vote For
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center">
                      <Vote className="w-4 h-4 mr-1" />
                      Vote Against
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
