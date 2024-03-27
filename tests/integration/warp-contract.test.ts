import { ArweaveSigner } from 'arbundles';
import { Transaction } from 'warp-contracts';

import { WarpContract } from '../../src/common/contracts/warp-contract';
import { WriteInteractionError } from '../../src/common/error';
import { ANTState } from '../../src/contract-state';
import { arweave, localCacheUrl, warp } from '../constants';

describe('warp-contract client', () => {
  let signer: ArweaveSigner;
  let contractTxId: string;
  let contract: WarpContract<ANTState>;

  beforeAll(() => {
    contractTxId = process.env.DEPLOYED_ANT_CONTRACT_TX_ID!;
    signer = new ArweaveSigner(JSON.parse(process.env.PRIMARY_WALLET_JWK!));
    contract = new WarpContract<ANTState>({
      cacheUrl: localCacheUrl,
      contractTxId,
      warp,
    });
  });

  it('should connect and return a valid instance', async () => {
    expect(contract.connect(signer)).toBeDefined();
    expect(contract).toBeInstanceOf(WarpContract);
  });

  it('should write a transaction', async () => {
    const tx = await contract
      .writeInteraction({
        functionName: 'setName',
        inputs: {
          name: 'test',
        },
      })
      .catch((e) => {
        console.error(e);
        return e;
      });

    expect(tx).toBeDefined();
    expect(tx).toBeInstanceOf(Transaction);
  });

  it('should fail to write a transaction', async () => {
    const contract: WarpContract<ANTState> = new WarpContract<ANTState>({
      cacheUrl: localCacheUrl,
      contractTxId,
      arweave,
    }).connect(signer);

    const error = await contract
      .writeInteraction({
        functionName: 'test-fail',
        inputs: {
          name: 'test',
        },
      })
      .catch((e) => e);

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(WriteInteractionError);
  });
});
