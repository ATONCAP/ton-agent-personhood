import { create } from 'zustand';
import { contractService, AgentInfo, EconomicProfile } from '../services/contractService';

interface Proposal {
  id: number;
  title: string;
  description: string;
  creator: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'failed';
  deadline: string;
  type: string;
}

// Use AgentInfo from contractService for consistency
interface Agent extends AgentInfo {
  id?: number; // Optional for backward compatibility
}

interface AgentState {
  // Agents
  agents: Agent[];
  currentAgent: Agent | null;
  loading: boolean;
  error: string | null;
  
  // Governance
  proposals: Proposal[];
  votingPower: number;
  
  // Contract status
  contractsReady: boolean;
  mockWarningsEnabled: boolean;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (address: string, updates: Partial<Agent>) => void;
  toggleMockWarnings: () => void;
  
  // Governance actions
  setProposals: (proposals: Proposal[]) => void;
  addProposal: (proposal: Proposal) => void;
  voteOnProposal: (proposalId: number, vote: 'for' | 'against', weight: number) => void;
  setVotingPower: (power: number) => void;
  
  // Contract interactions (CURRENTLY MOCKED)
  registerAgent: (name: string, metadata: string) => Promise<void>;
  stakeTokens: (amount: number) => Promise<void>;
  requestLoan: (amount: number, collateral: number) => Promise<void>;
  createProposal: (title: string, description: string, type: string) => Promise<void>;
  loadAgents: () => Promise<void>;
  loadEconomicProfile: (agentAddress: string) => Promise<EconomicProfile | null>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  // Initial state
  agents: [],
  currentAgent: null,
  loading: false,
  error: null,
  proposals: [],
  votingPower: 1000,
  contractsReady: contractService.isConnected(),
  mockWarningsEnabled: false, // Reduced noise
  
  // Basic setters
  setAgents: (agents) => set({ agents }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  toggleMockWarnings: () => set((state) => ({ mockWarningsEnabled: !state.mockWarningsEnabled })),
  
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent]
  })),
  
  updateAgent: (address, updates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.address === address ? { ...agent, ...updates } : agent
    )
  })),
  
  // Governance
  setProposals: (proposals) => set({ proposals }),
  
  addProposal: (proposal) => set((state) => ({
    proposals: [...state.proposals, proposal]
  })),
  
  voteOnProposal: (proposalId, vote, weight) => set((state) => ({
    proposals: state.proposals.map(proposal =>
      proposal.id === proposalId
        ? {
            ...proposal,
            votesFor: vote === 'for' ? proposal.votesFor + weight : proposal.votesFor,
            votesAgainst: vote === 'against' ? proposal.votesAgainst + weight : proposal.votesAgainst
          }
        : proposal
    )
  })),
  
  setVotingPower: (power) => set({ votingPower: power }),
  
  // Contract interactions - MOCK IMPLEMENTATIONS
  registerAgent: async (name: string, metadata: string) => {
    const { mockWarningsEnabled } = get();
    set({ loading: true, error: null });
    
    try {
      if (mockWarningsEnabled) console.log('🔴 MOCK: registerAgent()');
      
      const result = await contractService.registerAgent(name, metadata);
      
      if (result.success) {
        // Create mock agent data
        const newAgent: Agent = {
          address: 'EQC_' + Math.random().toString(36).substr(2, 9),
          name,
          owner: 'EQOwner_' + Math.random().toString(36).substr(2, 6),
          reputation: 1000,
          isActive: true,
          metadata,
          registrationDate: Date.now()
        };
        
        get().addAgent(newAgent);
        set({ currentAgent: newAgent });
      } else {
        throw new Error('Registration failed');
      }
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  stakeTokens: async (amount: number) => {
    const { mockWarningsEnabled } = get();
    set({ loading: true, error: null });
    
    try {
      if (mockWarningsEnabled) console.log('🔴 MOCK: stakeTokens()');
      
      const result = await contractService.stakeTokens(amount);
      
      if (!result.success) {
        throw new Error('Staking failed');
      }
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Staking failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  requestLoan: async (amount: number, collateral: number) => {
    const { mockWarningsEnabled } = get();
    set({ loading: true, error: null });
    
    try {
      if (mockWarningsEnabled) console.log('🔴 MOCK: requestLoan()');
      
      const result = await contractService.requestLoan(amount, collateral);
      
      if (!result.success) {
        throw new Error('Loan request failed');
      }
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Loan request failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  createProposal: async (title: string, description: string, type: string) => {
    const { mockWarningsEnabled } = get();
    set({ loading: true, error: null });
    
    try {
      // TODO: Use contractService.createProposal() when implemented
      if (mockWarningsEnabled) console.log('🔴 MOCK: Creating proposal:', { title, description, type });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const newProposal: Proposal = {
        id: Date.now(),
        title,
        description,
        creator: get().currentAgent?.name || 'Anonymous',
        votesFor: 0,
        votesAgainst: 0,
        status: 'active',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type
      };
      
      get().addProposal(newProposal);
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Proposal creation failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  loadAgents: async () => {
    const { mockWarningsEnabled } = get();
    set({ loading: true, error: null });
    
    try {
      if (mockWarningsEnabled) console.log('🔴 MOCK: loadAgents()');
      
      const agents = await contractService.getAllAgents();
      set({ agents });
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load agents' });
    } finally {
      set({ loading: false });
    }
  },
  
  loadEconomicProfile: async (agentAddress: string) => {
    const { mockWarningsEnabled } = get();
    
    try {
      if (mockWarningsEnabled) console.log('🔴 MOCK: loadEconomicProfile()');
      return await contractService.getEconomicProfile(agentAddress);
    } catch (error) {
      console.error('Failed to load economic profile:', error);
      return null;
    }
  }
}));
