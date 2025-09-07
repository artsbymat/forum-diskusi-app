import { Skeleton } from './ui/skeleton';

export function LoadingThreadCard() {
  return (
    <div>
      <Skeleton className="w-full h-[200px] rounded-md mb-4" />
      <Skeleton className="w-full h-[200px] rounded-md mb-4" />
      <Skeleton className="w-full h-[200px] rounded-md mb-4" />
      <Skeleton className="w-full h-[200px] rounded-md mb-4" />
      <Skeleton className="w-full h-[200px] rounded-md mb-4" />
    </div>
  );
}
