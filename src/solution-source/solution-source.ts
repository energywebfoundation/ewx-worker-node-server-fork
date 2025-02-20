import { downloadSolution } from './ipfs';
import { MAIN_CONFIG } from '../config';
import { localRead } from './local';

export const getSmartFlow = async (rawWorklogic: string, derivedLogger): Promise<string | null> => {
  derivedLogger.info('requesting solution SmartFlow content');

  const solution = await getSolutionSmartFlow(rawWorklogic);

  if (solution == null) {
    derivedLogger.warn('SmartFlow does not have contents');

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const successfulValidation: boolean = validateMessage(solution, derivedLogger);

  if (!successfulValidation) {
    derivedLogger.warn('SmartFlow did not pass validation');

    return null;
  }

  return JSON.stringify(solution);
};

const getSolutionSmartFlow = async (rawWorklogic: string): Promise<any | null> => {
  const hasProtocol = /^(.+):(.+)/.exec(rawWorklogic);

  if (hasProtocol != null) {
    const protocol = hasProtocol[1];
    const worklogicId = hasProtocol[2];

    if (protocol === 'ipfs') {
      return await downloadSolution(
        MAIN_CONFIG.IPFS_API_KEY,
        MAIN_CONFIG.IPFS_SECRET_KEY,
        MAIN_CONFIG.IPFS_URL,
        MAIN_CONFIG.IPFS_CONTEXT_PATH,
        worklogicId,
      );
    } else if (protocol === 'local') {
      return localRead(worklogicId);
    } else {
      return null;
    }
  }
};

const validateMessage = (data: { label: string; nodes: string }, derivedLogger): boolean => {
  if (data == null) {
    derivedLogger.error('expected solutions contents to not be null');

    return false;
  }

  if (typeof data !== 'object') {
    derivedLogger.error('expected solution contents to be an object');

    return false;
  }

  if (data.label == null) {
    derivedLogger.error(`label is missing`);

    return false;
  }

  if (data.nodes == null || !Array.isArray(data.nodes)) {
    derivedLogger.error('nodes are missing');

    return false;
  }

  return true;
};
