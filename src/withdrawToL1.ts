import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { getConfig, Workflows, TokenType, ERC721Withdrawal, generateStarkWallet } from '@imtbl/core-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

const alchemyApiKey = requireEnvironmentVariable("ALCHEMY_API_KEY");
const ethNetwork = 'ropsten';
const privateKey = requireEnvironmentVariable("PRIVATE_KEY1");

// Setup provider and signer
const provider = new AlchemyProvider(ethNetwork, alchemyApiKey);
const signer = new Wallet(privateKey).connect(provider);

// Configure Core SDK Workflow class
const config = getConfig(ethNetwork);
const workflows = new Workflows(config);

(async (): Promise<void> => {
  const startWallet = await generateStarkWallet(signer);

  const tokenWithdrawal: ERC721Withdrawal = {
    type: TokenType.ERC721,
    data: {
      tokenId: '5',
      tokenAddress: requireEnvironmentVariable("TOKEN_ADDRESS"),
    }
  };

  // To withdraw token to L1, token needs to have status `Withdrawable`!!! Need to wait several hours after calling prepareWitgDrawToL1
  const response = await workflows.completeERC721Withdrawal(signer, startWallet.starkPublicKey, tokenWithdrawal);
  console.log(response);

})().catch(e => {
  console.log(e);
  process.exit(1);
});