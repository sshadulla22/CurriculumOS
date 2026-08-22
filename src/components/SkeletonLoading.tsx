type SkeletonLoadingProps = {
  label?: string;
  admin?: boolean;
};

export default function SkeletonLoading({ label = 'Loading content', admin = false }: SkeletonLoadingProps) {
  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
      aria-busy="true"
      aria-label={label}
    >
      <div className={`mx-auto ${admin ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <div
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div
            className="h-6 w-36 animate-pulse rounded"
            style={{ backgroundColor: 'var(--skeleton-base)' }}
          />
          <div
            className="h-9 w-9 animate-pulse rounded-md"
            style={{ backgroundColor: 'var(--skeleton-base)' }}
          />
        </div>
        <div className="mt-12 space-y-4">
          <div
            className="h-3 w-24 animate-pulse rounded"
            style={{ backgroundColor: 'var(--skeleton-base)' }}
          />
          <div
            className="h-10 w-2/3 max-w-md animate-pulse rounded"
            style={{ backgroundColor: 'var(--skeleton-base)' }}
          />
          <div
            className="h-4 w-full max-w-2xl animate-pulse rounded"
            style={{ backgroundColor: 'var(--skeleton-shimmer)' }}
          />
          <div
            className="h-4 w-5/6 max-w-xl animate-pulse rounded"
            style={{ backgroundColor: 'var(--skeleton-shimmer)' }}
          />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="space-y-4 rounded-xl p-5"
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <div
                className="h-4 w-1/3 animate-pulse rounded"
                style={{ backgroundColor: 'var(--skeleton-base)' }}
              />
              <div
                className="h-3 w-full animate-pulse rounded"
                style={{ backgroundColor: 'var(--skeleton-shimmer)' }}
              />
              <div
                className="h-3 w-4/5 animate-pulse rounded"
                style={{ backgroundColor: 'var(--skeleton-shimmer)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}