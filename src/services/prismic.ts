import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { NextApiRequestLike } from '@prismicio/next/dist/types';

export interface PrismicConfig {
  req?: NextApiRequestLike;
}

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient('SpaceTraveling', {
    accessToken: process.env.PRISMIC_API_ENDPOINT
  });

  // enableAutoPreviews({
  //   client,
  //   req: config.req
  // });

  return client;
}
