import { getSiteContent } from '@/lib/db';
import ClientLandingPage from './components/ClientLandingPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const content = await getSiteContent();
  return <ClientLandingPage initialContent={content} />;
}
