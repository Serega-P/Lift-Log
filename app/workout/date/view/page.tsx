export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import WorkoutClientView from './WorkoutClientView';

export default function WorkoutViewWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkoutClientView />
    </Suspense>
  );
}
