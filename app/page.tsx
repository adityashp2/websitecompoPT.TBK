import { getSiteContent } from '@/lib/db';
import ClientLandingPage from './components/ClientLandingPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const content = getSiteContent();
  return <ClientLandingPage initialContent={content} />;
}
