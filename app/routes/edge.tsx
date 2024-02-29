import { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@vercel/remix';

export const config = { runtime: 'edge' };


// This `loader` now runs as an Edge Function
export async function loader({ request }: LoaderFunctionArgs) {
  // You have access to the incoming request headers
  // including powerful geolocation headers added by Vercel
  // e.g. request.headers.get('x-vercel-ip-city')

  return json({})​;
}