export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ClientPage from './ClientPage';

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
