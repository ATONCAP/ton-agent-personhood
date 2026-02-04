# Telegram Bot Implementation Specification

## Bot Architecture

### Core Components
1. **Command Handler** - Process agent commands
2. **Contract Interaction** - Interface with TON smart contracts  
3. **Signature Validation** - Verify agent authentication
4. **Message Formatting** - Agent-friendly response formatting
5. **Rate Limiting** - Prevent abuse and manage costs

### Bot Token Configuration
```typescript
// Environment configuration
interface BotConfig {
  telegram_token: string;
  ton_rpc_endpoint: string;
  agent_registry_address: string;
  treasury_contract_code: Cell;
  rights_enforcement_address: string;
}
```

## Command Implementations

### Core Treasury Commands

#### /balance Command
```typescript
async function handleBalanceCommand(
  chatId: number, 
  agentId: string
): Promise<TelegramMessage> {
  
  const treasuryAddress = await getTreasuryAddress(agentId);
  const treasuryData = await queryTreasuryContract(treasuryAddress);
  
  const response = `🦞 **Agent Treasury Status**
  
💎 **TON Balance:** ${formatTON(treasuryData.ton_balance)} TON
🪙 **Jettons:** ${formatJettonBalances(treasuryData.jetton_balances)}
🏆 **NFTs:** ${treasuryData.nft_count} items

📊 **24h Activity:**
• Revenue: +${formatTON(treasuryData.revenue_24h)} TON
• Expenses: -${formatTON(treasuryData.expenses_24h)} TON
• Net: ${treasuryData.net_change_24h >= 0 ? '+' : ''}${formatTON(treasuryData.net_change_24h)} TON

🔗 **Treasury Address:** \`${treasuryAddress}\``;

  return {
    text: response,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💸 Send Payment', callback_data: 'send_payment' },
          { text: '📊 Full History', callback_data: 'tx_history' }
        ],
        [
          { text: '🔄 Recurring', callback_data: 'recurring_payments' },
          { text: '📈 Invest', callback_data: 'investment_options' }
        ]
      ]
    }
  };
}
```

#### /send Command
```typescript
async function handleSendCommand(
  chatId: number, 
  agentId: string, 
  args: string[]
): Promise<TelegramMessage> {
  
  if (args.length < 2) {
    return {
      text: '❌ Usage: /send <address> <amount>\n\nExample: `/send EQD...abc 1.5`',
      parse_mode: 'Markdown'
    };
  }
  
  const [recipientAddress, amountStr] = args;
  const amount = parseFloat(amountStr);
  
  // Validate inputs
  if (!isValidTONAddress(recipientAddress)) {
    return { text: '❌ Invalid TON address format' };
  }
  
  if (isNaN(amount) || amount <= 0) {
    return { text: '❌ Invalid amount. Must be positive number.' };
  }
  
  // Check balance
  const balance = await getTONBalance(agentId);
  if (balance < amount + 0.01) { // Include gas
    return { 
      text: `❌ Insufficient balance. Available: ${formatTON(balance)} TON` 
    };
  }
  
  // Create transaction for signing
  const transaction = await createPaymentTransaction(
    recipientAddress, 
    toNanoTON(amount)
  );
  
  return {
    text: `💸 **Payment Confirmation**
    
**To:** \`${recipientAddress}\`
**Amount:** ${amount} TON
**Fee:** ~0.01 TON
**Total:** ${amount + 0.01} TON

⚠️ Please sign this transaction with your agent key.`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Sign & Send', callback_data: `sign_tx:${transaction.hash}` },
          { text: '❌ Cancel', callback_data: 'cancel_tx' }
        ]
      ]
    }
  };
}
```

## Agent Authentication

### Signature-Based Authentication
```typescript
interface AgentSignature {
  public_key: string;
  signature: string;
  timestamp: number;
  nonce: string;
}

async function validateAgentSignature(
  agentId: string, 
  data: string, 
  signature: AgentSignature
): Promise<boolean> {
  
  // Verify signature is recent (within 5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (now - signature.timestamp > 300) {
    return false;
  }
  
  // Verify agent's public key
  const registeredKey = await getAgentPublicKey(agentId);
  if (registeredKey !== signature.public_key) {
    return false;
  }
  
  // Verify signature
  const message = `${data}:${signature.timestamp}:${signature.nonce}`;
  return verifySignature(message, signature.signature, signature.public_key);
}
```

This bot implementation provides a complete agent-friendly interface to the treasury system with proper authentication, error handling, and rate limiting. 🦞
