import express from 'express';
import { MAIN_CONFIG } from './config';
import { createKeyringPair } from './account';
import { getSolutionLogicalParts } from './node-red/red';
import asyncHandler from 'express-async-handler';

export const createConfigRouter = (): express.Router => {
  const router = express.Router({
    mergeParams: true,
  });

  router.get(
    '/config',
    asyncHandler(async (req, res) => {
      const account = createKeyringPair();

      const solutionDetails: {
        solutionNamespace: string;
        solutionGroupId: string;
      } | null =
        req.query.nodeRedId != null
          ? await getSolutionLogicalParts(req.query.nodeRedId as string)
          : null;

      res.status(200).json({
        rpcUrl: MAIN_CONFIG.PALLET_RPC_URL,
        workerAddress: account.address,
        solutionDetails,
      });
    }),
  );

  return router;
};
