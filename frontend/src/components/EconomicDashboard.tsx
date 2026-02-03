import { useState } from 'react';
import { Wallet, TrendingUp, CreditCard, DollarSign } from 'lucide-react';

export function EconomicDashboard() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('30');

  // Mock data - would come from smart contract
  const economicProfile = {
    balance: '24.7',
    stakedAmount: '10.0',
    creditScore: 1450,
    activeLoans: 2,
    totalRevenue: '156.3',
    lastActivity: '2026-02-03'
  };

  const loanEligibility = {
    maxLoan: '45.0',
    interestRate: '5.2%',
    eligible: true
  };

  return (
    <div className="space-y-8">
      {/* Economic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100">Total Balance</div>
              <div className="text-3xl font-bold">{economicProfile.balance} TON</div>
            </div>
            <Wallet className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-100">Staked Amount</div>
              <div className="text-3xl font-bold">{economicProfile.stakedAmount} TON</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-100">Credit Score</div>
              <div className="text-3xl font-bold">{economicProfile.creditScore}/2000</div>
            </div>
            <CreditCard className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Staking Section */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Stake for Credit Score
          </h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Current Credit Score: <strong>{economicProfile.creditScore}/2000</strong>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full"
                style={{ width: `${(economicProfile.creditScore / 2000) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stake Amount (TON)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Minimum 0.1 TON"
                step="0.1"
                min="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-800">
                <div className="font-medium mb-1">Staking Benefits:</div>
                <div>• +1 credit point per 0.1 TON staked</div>
                <div>• Increased loan eligibility</div>
                <div>• Enhanced governance voting power</div>
              </div>
            </div>
            
            <button
              disabled={!stakeAmount || parseFloat(stakeAmount) < 0.1}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stake {stakeAmount || '0'} TON
            </button>
          </div>
        </div>

        {/* Lending Section */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Agent Lending
          </h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Loan Eligibility: 
              <strong className="text-green-600 ml-1">
                {loanEligibility.eligible ? `Up to ${loanEligibility.maxLoan} TON` : 'Not Eligible'}
              </strong>
            </div>
            <div className="text-sm text-gray-600">
              Interest Rate: <strong>{loanEligibility.interestRate} APR</strong>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (TON)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder={`Max: ${loanEligibility.maxLoan} TON`}
                step="0.1"
                min="0.1"
                max={loanEligibility.maxLoan}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <select
                value={loanDuration}
                onChange={(e) => setLoanDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-800">
                <div className="font-medium mb-1">Loan Terms:</div>
                <div>• Unsecured lending based on reputation</div>
                <div>• Automatic repayment from revenue</div>
                <div>• Credit score improvement on-time payment</div>
              </div>
            </div>
            
            <button
              disabled={!loanAmount || !loanEligibility.eligible}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Loan
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Tracking */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue & Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{economicProfile.totalRevenue} TON</div>
            <div className="text-gray-600">Total Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{economicProfile.activeLoans}</div>
            <div className="text-gray-600">Active Loans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{economicProfile.lastActivity}</div>
            <div className="text-gray-600">Last Activity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
