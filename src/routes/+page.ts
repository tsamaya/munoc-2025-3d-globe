import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const title = 'Munoc 2025 - Globe';
  const site_name = 'Munoc 2025 - Globe';
  const site_description = 'This is the Munoc 2025 3d globe.';

  return {
    title,
    site_name,
    site_description,
  };
};
