import axios, { type AxiosInstance } from 'axios';
import { createLogger } from '../util';
import { MAIN_CONFIG } from '../config';
import { PrometheusClient } from '../metrics/prometheus';

const ipfsLogger = createLogger('IPFS');

export interface IPFSDownloadOptions {
  ipfsApiKey: string | null;
  ipfsSecretKey: string | null;
  ipfsUrl: string;
  ipfsContextPath: string;
  solutionWorklogic: string;
}

export const downloadSolution = async (
  options: IPFSDownloadOptions,
): Promise<{ label: string; nodes: string } | null> => {
  const { ipfsApiKey, ipfsSecretKey, ipfsUrl, ipfsContextPath, solutionWorklogic } = options;

  if (ipfsApiKey != null && ipfsSecretKey != null) {
    ipfsLogger.info(
      {
        ipfsUrl,
        ipfsContextPath,
        solutionWorklogic,
      },
      `downloading SmartFlow using credentials`,
    );

    const axiosInstance: AxiosInstance = axios.create({
      headers: {
        Authorization: createAuthorization(ipfsApiKey, ipfsSecretKey),
      },
    });

    PrometheusClient.ipfsInstallSum.inc(1);

    const flowSource = `${ipfsUrl}${ipfsContextPath}${solutionWorklogic}`;

    const response = await axiosInstance.post(flowSource);

    return response.data;
  }

  ipfsLogger.info(
    {
      ipfsUrl,
      ipfsContextPath,
      solutionWorklogic,
    },
    `downloading SmartFlow without credentials`,
  );

  const axiosInstance: AxiosInstance = axios.create({
    headers: {
      'User-Agent': MAIN_CONFIG.IPFS_USER_AGENT_VALUE,
    },
  });

  const flowSource = `${ipfsUrl}${ipfsContextPath}${solutionWorklogic}`;

  const response = await axiosInstance.get(flowSource);

  PrometheusClient.ipfsInstallSum.inc(1);

  return response.data;
};

const createAuthorization = (ipfsApiKey: string, ipfsSecretKey: string): string => {
  return 'Basic ' + Buffer.from(ipfsApiKey + ':' + ipfsSecretKey, 'binary').toString('base64');
};
