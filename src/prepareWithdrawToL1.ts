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

  // Prepers token to withdrawal. Changes status from `Owned` to `Preparing Withdrawal`. To complete withdrawat wait for status to change `Withdrawable`
  // and then call withdrawToL1 script.
  const response = await workflows.prepareWithdrawal(signer, startWallet, tokenWithdrawal, "1");
  console.log(response);

})().catch(e => {
  console.log(e);
  process.exit(1);
});