import client from 'prom-client';
import { MAIN_CONFIG } from '../config';
import { type Express } from 'express';
import { getAllInstalledSolutionsNames } from '../node-red/red';

const register = new client.Registry();

export const PrometheusClient = {
  httpRequestsTotal: new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
  }),
  httpRequestsDurationSeconds: new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [register],
  }),
  pendingVotesGauge: new client.Gauge({
    name: 'active_jobs',
    help: 'Current number of pending votes',
    registers: [register],
  }),
  installedSolutions: new client.Gauge({
    name: 'installed_solutions',
    help: 'Current number of installed solutions',
    registers: [register],
  }),
  solutionInstallsSum: new client.Counter({
    name: 'solution_installs_sum',
    help: 'Total number of solution installs',
    registers: [register],
  }),
  solutionFailedInstallsSum: new client.Counter({
    name: 'solution_failed_installs_sum',
    help: 'Total number of failed solution installs',
    registers: [register],
  }),
  rpcCallsTotal: new client.Counter({
    name: 'rpc_calls_total',
    help: 'Total number of RPC calls',
    labelNames: ['method'],
    registers: [register],
  }),
  createReadApi: new client.Counter({
    name: 'create_read_api_calls_total',
    help: 'Total number of create read api calls',
    registers: [register],
  }),
  createWriteApi: new client.Counter({
    name: 'create_write_api_calls_total',
    help: 'Total number of create write api calls',
    registers: [register],
  }),
  disconnectReadApi: new client.Counter({
    name: 'disconnect_read_api_calls_total',
    help: 'Total number of disconnect read api calls',
    registers: [register],
  }),
  disconnectWriteApi: new client.Counter({
    name: 'disconnect_write_api_calls_total',
    help: 'Total number of disconnect write api calls',
    registers: [register],
  }),
  totalVotesSum: new client.Counter({
    name: 'total_votes_sum',
    help: 'Total number of votes sum',
    labelNames: ['solutionNamespace'],
    registers: [register],
  }),
  totalVotesAttempts: new client.Counter({
    name: 'total_votes_attempts',
    help: 'Total number of votes attempts',
    labelNames: ['solutionNamespace'],
    registers: [register],
  }),
  totalFailedVotesSum: new client.Counter({
    name: 'total_failed_votes_sum',
    help: 'Total number of failed votes sum',
    labelNames: ['solutionNamespace'],
    registers: [register],
  }),
  ipfsInstallSum: new client.Counter({
    name: 'ipfs_install_sum',
    help: 'Total number of ipfs installs',
    registers: [register],
  }),
};

export const setupPrometheus = async (app: Express): Promise<void> => {
  if (!MAIN_CONFIG.ENABLE_PROMETHEUS) {
    return;
  }

  if (MAIN_CONFIG.PROMETHEUS_ENABLE_DEFAULT_METRICS) {
    client.collectDefaultMetrics({
      register,
      prefix: MAIN_CONFIG.PROMETHEUS_DEFAULT_METRICS_PREFIX,
    });
  }

  app.use((req, res, next) => {
    const end = PrometheusClient.httpRequestsDurationSeconds.startTimer();

    res.on('finish', () => {
      const route = (Boolean(req.route) && Boolean(req.route.path)) || req.path !== '' || 'unknown';

      const labels = {
        method: req.method,
        route,
        status_code: res.statusCode,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      PrometheusClient.httpRequestsTotal.inc(labels as any);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      end(labels as any);
    });

    next();
  });

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
};

export const storeInstalledSolutions = (): void => {
  if (!MAIN_CONFIG.ENABLE_PROMETHEUS) {
    return;
  }

  setInterval(() => {
    void getAllInstalledSolutionsNames().then((x) => {
      PrometheusClient.installedSolutions.set(x.length);
    });
  }, 20000);
};
