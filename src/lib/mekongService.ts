export interface MekongResource {
  id: string;
  datasetTitle: string;
  resourceName: string;
  url: string;
  format: string;
  datasetUrl?: string;
}

export const FALLBACK_MEKONG_DATASETS: MekongResource[] = [
  {
    id: 'vn-env-stats-01',
    datasetTitle: 'Vietnam Environmental Statistics & Emission Telemetry',
    resourceName: 'Vietnam Annual Carbon & Air Quality Index',
    url: 'https://data.opendevelopmentmekong.net/dataset/84ef9c28-7aaf-4be5-9e11-57c02b2f3423/resource/1bff782b-a21f-4a9c-b142-6b17f1c14568/download/wb-data-country-vietnam..csv',
    format: 'CSV',
    datasetUrl: 'https://data.opendevelopmentmekong.net/dataset/worldbank-data-country-vietnam',
  },
  {
    id: 'vn-tree-loss-02',
    datasetTitle: 'Vietnam & Lower Mekong Forest Cover Loss Metrics',
    resourceName: 'Mekong Regional Tree Cover Loss (ha)',
    url: 'https://data.opendevelopmentcambodia.net/km/dataset/0efa2669-bcbf-4d95-87b8-9d64f6fee6ba/resource/04c73960-6c5c-4499-aa49-4446dd355eef/download/kh_treecover_loss__ha.csv',
    format: 'CSV',
    datasetUrl: 'https://data.opendevelopmentmekong.net/dataset/tree-cover-loss-in-cambodia',
  },
  {
    id: 'vn-industry-03',
    datasetTitle: 'Vietnam & ASEAN Regional Industrial Sector Indicators',
    resourceName: 'Industrial Classification & Production Output Index',
    url: 'https://data.opendevelopmentcambodia.net/km/dataset/53e5a5d5-cff4-4c69-bae4-fc29fa3323d3/resource/37ba3345-c867-41b7-b91d-78d9ab7d58b4/download/cambodiastandardindustrialclassificationcsiccode.csv',
    format: 'CSV',
    datasetUrl: 'https://data.opendevelopmentmekong.net/dataset/cambodia-standard-industrial-classification-csic',
  },
];

const CKAN_API_URL = 'https://data.opendevelopmentmekong.net/api/3/action/package_search?q=res_format:CSV&rows=50';

export async function fetchMekongDatasets(): Promise<MekongResource[]> {
  try {
    const res = await fetch(CKAN_API_URL);
    if (!res.ok) {
      throw new Error(`CKAN API response error: ${res.status}`);
    }
    const data = await res.json();
    if (!data.success || !data.result || !data.result.results) {
      return FALLBACK_MEKONG_DATASETS;
    }

    const resources: MekongResource[] = [];

    data.result.results.forEach((pkg: Record<string, unknown>) => {
      const titleTranslated = pkg.title_translated as Record<string, string> | undefined;
      const title =
        titleTranslated?.en ||
        titleTranslated?.vi ||
        (typeof pkg.title === 'string' ? pkg.title : '') ||
        (typeof pkg.name === 'string' ? pkg.name : '') ||
        'Open Mekong Dataset';

      const pkgUrl = pkg.name
        ? `https://data.opendevelopmentmekong.net/dataset/${pkg.name}`
        : undefined;

      if (Array.isArray(pkg.resources)) {
        pkg.resources.forEach((r: Record<string, unknown>) => {
          const fmt = str(r.format).toUpperCase();
          const rUrl = str(r.url);
          if (fmt === 'CSV' || rUrl.toLowerCase().includes('.csv') || rUrl.toLowerCase().includes('csv')) {
            resources.push({
              id: typeof r.id === 'string' ? r.id : `res-${Math.random().toString(36).substring(2, 9)}`,
              datasetTitle: title,
              resourceName: typeof r.name === 'string' ? r.name : title,
              url: rUrl,
              format: 'CSV',
              datasetUrl: pkgUrl,
            });
          }
        });
      }
    });

    return resources.length > 0 ? resources : FALLBACK_MEKONG_DATASETS;
  } catch (err) {
    console.warn('Failed to fetch Mekong datasets directly from CKAN API, using fallback datasets:', err);
    return FALLBACK_MEKONG_DATASETS;
  }
}

function str(val: unknown): string {
  return val ? String(val) : '';
}

export async function fetchCsvContent(csvUrl: string): Promise<string> {
  // Try direct fetch first
  try {
    const directRes = await fetch(csvUrl);
    if (directRes.ok) {
      const text = await directRes.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    }
  } catch {
    // CORS or network error, proceed to fallback proxy
  }

  // Fallback via Cloudflare Worker CORS proxy
  const proxyUrl = `/api/cors-proxy?url=${encodeURIComponent(csvUrl)}`;
  const proxyRes = await fetch(proxyUrl);
  if (!proxyRes.ok) {
    throw new Error(`Failed to fetch CSV content via CORS proxy (${proxyRes.status})`);
  }
  return await proxyRes.text();
}
