import { redirect } from 'next/navigation';
import { routing } from '@/routing';

export const dynamic = 'force-dynamic';

export default async function RootPage() {
  redirect(routing.defaultLocale);
}