import { create } from 'zustand';
import { contractService, Agent, EconomicProfile } from '../services/contractService';

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
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: number, updates: Partial<Agent>) => void;
  
  // Governance actions
  setProposals: (proposals: Proposal[]) => void;
  addProposal: (proposal: Proposal) => void;
  voteOnProposal: (proposalId: number, vote: 'for' | 'against', weight: number) => void;
  setVotingPower: (power: number) => void;
  
  // Contract interactions (CURRENTLY MOCKED)
  registerAgent: (name: string, verificationData: string, metadata: string) => Promise<void>;
  stakeTokens: (agentId: number, amount: string) => Promise<void>;
  requestLoan: (agentId: number, amount: string, duration: number) => Promise<void>;
  createProposal: (title: string, description: string, type: string) => Promise<void>;
  loadAgents: () => Promise<void>;
  loadEconomicProfile: (agentId: number) => Promise<EconomicProfile | null>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  // Initial state
  agents: [],
  currentAgent: null,
  loading: false,
  error: null,
  proposals: [],
  votingPower: 1000,
  contractsReady: contractService.isReady(),
  
  // Basic setters
  setAgents: (agents) => set({ agents }),
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent]
  })),
  
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
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
  
  // Contract interactions - EXPLICITLY MARKED AS MOCKED
  registerAgent: async (name, verificationData, metadata) => {
    set({ loading: true, error: null });
    
    try {
      console.log('🔴 USING MOCK CONTRACT SERVICE');
      const result = await contractService.registerAgent(name, verificationData, metadata);
      
      if (result.success) {
        const newAgent: Agent = {
          id: result.agentId!,
          name,
          address: 'EQC...' + Math.random().toString(36).substr(2, 9),
          reputation: 1000,
          verified: false,
          creationTime: new Date().toISOString().split('T')[0]
        };
        
        get().addAgent(newAgent);
        set({ currentAgent: newAgent });
      } else {
        throw new Error(result.error || 'Registration failed');
      }
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  stakeTokens: async (agentId, amount) => {
    set({ loading: true, error: null });
    
    try {
      console.log('🔴 USING MOCK CONTRACT SERVICE');
      const result = await contractService.stakeTokens(agentId, amount);
      
      if (!result.success) {
        throw new Error(result.error || 'Staking failed');
      }
      
      // Mock update of agent's profile would go here
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Staking failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  requestLoan: async (agentId, amount, duration) => {
    set({ loading: true, error: null });
    
    try {
      console.log('🔴 USING MOCK CONTRACT SERVICE');
      const result = await contractService.requestLoan(agentId, amount, duration);
      
      if (!result.success) {
        throw new Error(result.error || 'Loan request failed');
      }
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Loan request failed' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  createProposal: async (title, description, type) => {
    set({ loading: true, error: null });
    
    try {
      // TODO: Use contractService.createProposal() when implemented
      console.log('🔴 MOCK: Creating proposal:', { title, description, type });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    set({ loading: true, error: null });
    
    try {
      console.log('🔴 USING MOCK CONTRACT SERVICE');
      const agents = await contractService.getAllAgents();
      set({ agents });
      
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load agents' });
    } finally {
      set({ loading: false });
    }
  },
  
  loadEconomicProfile: async (agentId: number) => {
    try {
      console.log('🔴 USING MOCK CONTRACT SERVICE');
      return await contractService.getEconomicProfile(agentId);
    } catch (error) {
      console.error('Failed to load economic profile:', error);
      return null;
    }
  }
}));
