import { environment } from '../../environments/environment';

/** Whether affiliate page shows a brief skeleton flash while mock data "loads". */
export function isSimulatedAffiliateLoadingEnabled(): boolean {
  return environment.simulateAffiliateLoading;
}
