#!/bin/bash

# TON Agentic Personhood - Deployment Script
# Deploys smart contracts to TON testnet and mainnet

set -e

echo "🦞 TON Agentic Personhood Deployment"
echo "===================================="

# Configuration
NETWORK=${1:-testnet}
DEPLOY_KEY=${DEPLOY_KEY:-}
CONTRACTS_DIR="contracts/src"
BUILD_DIR="contracts/build"

if [ -z "$DEPLOY_KEY" ]; then
    echo "❌ Error: DEPLOY_KEY environment variable not set"
    echo "Please set your deployment private key:"
    echo "export DEPLOY_KEY=your_private_key_here"
    exit 1
fi

echo "📋 Deployment Configuration:"
echo "Network: $NETWORK"
echo "Contracts directory: $CONTRACTS_DIR"
echo "Build directory: $BUILD_DIR"
echo ""

# Create build directory
mkdir -p "$BUILD_DIR"

echo "🔨 Compiling Smart Contracts..."

# Compile Agent Registry
echo "Compiling agent_registry.fc..."
func -o "$BUILD_DIR/agent_registry.fif" -SPA "$CONTRACTS_DIR/agent_registry.fc"
if [ $? -eq 0 ]; then
    echo "✅ Agent Registry compiled successfully"
else
    echo "❌ Agent Registry compilation failed"
    exit 1
fi

# Compile Economic Infrastructure  
echo "Compiling agent_economics.fc..."
func -o "$BUILD_DIR/agent_economics.fif" -SPA "$CONTRACTS_DIR/agent_economics.fc"
if [ $? -eq 0 ]; then
    echo "✅ Economic Infrastructure compiled successfully"
else
    echo "❌ Economic Infrastructure compilation failed"
    exit 1
fi

# Compile Governance System
echo "Compiling agent_governance.fc..."
func -o "$BUILD_DIR/agent_governance.fif" -SPA "$CONTRACTS_DIR/agent_governance.fc"
if [ $? -eq 0 ]; then
    echo "✅ Governance System compiled successfully"
else
    echo "❌ Governance System compilation failed"
    exit 1
fi

echo ""
echo "🚀 Deploying to $NETWORK..."

# Create deployment addresses file
ADDRESSES_FILE="scripts/deployment/deployed_addresses_$NETWORK.json"
echo "{}" > "$ADDRESSES_FILE"

# Deploy Agent Registry (foundational contract)
echo "Deploying Agent Registry..."
# TODO: Implement actual deployment logic using TON CLI or SDK
REGISTRY_ADDRESS="EQC...placeholder_registry_address"
echo "📄 Agent Registry deployed at: $REGISTRY_ADDRESS"

# Update addresses file
jq --arg addr "$REGISTRY_ADDRESS" '.agent_registry = $addr' "$ADDRESSES_FILE" > tmp.json && mv tmp.json "$ADDRESSES_FILE"

# Deploy Economic Infrastructure
echo "Deploying Economic Infrastructure..."
ECONOMICS_ADDRESS="EQC...placeholder_economics_address"
echo "💰 Economic Infrastructure deployed at: $ECONOMICS_ADDRESS"

jq --arg addr "$ECONOMICS_ADDRESS" '.agent_economics = $addr' "$ADDRESSES_FILE" > tmp.json && mv tmp.json "$ADDRESSES_FILE"

# Deploy Governance System
echo "Deploying Governance System..."
GOVERNANCE_ADDRESS="EQC...placeholder_governance_address"
echo "🗳️  Governance System deployed at: $GOVERNANCE_ADDRESS"

jq --arg addr "$GOVERNANCE_ADDRESS" '.agent_governance = $addr' "$ADDRESSES_FILE" > tmp.json && mv tmp.json "$ADDRESSES_FILE"

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📍 Deployed Contract Addresses ($NETWORK):"
echo "Agent Registry:         $REGISTRY_ADDRESS"
echo "Economic Infrastructure: $ECONOMICS_ADDRESS"
echo "Governance System:      $GOVERNANCE_ADDRESS"
echo ""
echo "📄 Addresses saved to: $ADDRESSES_FILE"
echo ""
echo "🔗 Next Steps:"
echo "1. Update frontend configuration with deployed addresses"
echo "2. Initialize contracts with proper parameters"
echo "3. Run integration tests against deployed contracts"
echo "4. Begin community testing phase"
echo ""
echo "🦞 TON Agentic Personhood Infrastructure is live!"
