import axios, { type AxiosInstance } from 'axios';

export const downloadSolution = async (
  ipfsApiKey: string,
  ipfsSecretKey: string,
  ipfsUrl: string,
  ipfsContextPath: string,
  solutionWorkLogic: string,
): Promise<{ label: string; nodes: string } | null> => {
  const axiosInstance: AxiosInstance = axios.create({
    headers: {
      Authorization: createAuthorization(ipfsApiKey, ipfsSecretKey),
    },
  });

  const flowSource = `${ipfsUrl}${ipfsContextPath}${solutionWorkLogic}`;

  const response = await axiosInstance.post(flowSource);

  return response.data;
};

const createAuthorization = (ipfsApiKey: string, ipfsSecretKey: string): string => {
  return 'Basic ' + Buffer.from(ipfsApiKey + ':' + ipfsSecretKey, 'binary').toString('base64');
};
