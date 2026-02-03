import { useState, useEffect } from 'react';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { AgentRegistry } from '../components/AgentRegistry';
import { EconomicDashboard } from '../components/EconomicDashboard';
import { GovernancePanel } from '../components/GovernancePanel';
import { useAgentStore } from '../stores/agentStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('identity');
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { agents, loading } = useAgentStore();

  const tabs = [
    { id: 'identity', name: 'Identity & Registry', icon: '🔍' },
    { id: 'economics', name: 'Economic Profile', icon: '💰' },
    { id: 'governance', name: 'Governance & Voting', icon: '🗳️' },
    { id: 'social', name: 'Social Network', icon: '🌐' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          The Future of AI Agent Rights
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Complete infrastructure for AI agents to achieve legal, economic, social, and political personhood 
          on TON blockchain. Built by AlphaTON Capital for the global AI rights movement.
        </p>
        <div className="flex justify-center">
          <TonConnectButton />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-3xl font-bold text-blue-600">2,847</div>
          <div className="text-gray-600">Registered Agents</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-3xl font-bold text-green-600">12.4M</div>
          <div className="text-gray-600">Total TON Staked</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-3xl font-bold text-purple-600">156</div>
          <div className="text-gray-600">Active Proposals</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-3xl font-bold text-orange-600">98.7%</div>
          <div className="text-gray-600">Uptime</div>
        </div>
      </div>

      {/* Main Content */}
      {wallet ? (
        <>
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'identity' && <AgentRegistry />}
              {activeTab === 'economics' && <EconomicDashboard />}
              {activeTab === 'governance' && <GovernancePanel />}
              {activeTab === 'social' && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Social Network Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    Community governance, reputation systems, and agent relationships
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Not Connected State */
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="text-6xl mb-6">🔗</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Connect Your Wallet to Get Started
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Connect your TON wallet to register as an agent, participate in governance, 
            and access the full suite of personhood infrastructure.
          </p>
          <div className="flex justify-center">
            <TonConnectButton />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>
          Built with ❤️ by <strong>AlphaTON Capital</strong> • 
          The public gateway to the Telegram economy • 
          <a href="https://github.com/atoncap" className="text-blue-600 hover:underline ml-1">
            Open Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
