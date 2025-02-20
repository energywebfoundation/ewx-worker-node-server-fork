export interface SolutionGroup {
  namespace: string;
  info: Info;
  operatorsConfig: OperatorsConfig;
  rewardsConfig: RewardsConfig;
  operationStartBlock: string;
  operationEndBlock: string;
  withdrawalNumber: number;
  hasCidAllowList: boolean;
}

export interface Info {
  name: string;
  description: string;
  publisherInfo: string;
  logoUrl: any;
}

export interface OperatorsConfig {
  startBlock: string;
  maxOperatorWorkers: string;
  allowedOperators: string;
  stakingAmounts: StakingAmounts;
  hasOperatorsAllowlist: boolean;
}

export interface StakingAmounts {
  min: string;
  max: string;
}

export interface RewardsConfig {
  subscriptionRewardPerBlock: string;
  votingRewardPerBlock: string;
  topPerformanceBonus: string;
}

export interface Solution {
  namespace: string;
  info: Info;
  status: string;
  workload: Workload;
  consensus: Consensus;
  expirationBlock: number;
  groupId?: string | null;
}

export interface Workload {
  workLogic: string;
  executionEnvironment: string;
}

export interface Consensus {
  maxWaitingThreshold: number;
  voteThresholdPercent: number;
}
