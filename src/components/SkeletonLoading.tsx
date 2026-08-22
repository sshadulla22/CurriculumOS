type SkeletonLoadingProps = {
  label?: string;
  admin?: boolean;
};

export default function SkeletonLoading({ label = 'Loading content', admin = false }: SkeletonLoadingProps) {
  return (
    <div
      className="min-h-screen bg-white px-6 py-10 text-zinc-950"
      aria-busy="true"
      aria-label={label}
    >
      <div className={`mx-auto ${admin ? 'max-w-6xl' : 'max-w-5xl'}`}>
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="h-6 w-36 animate-pulse rounded bg-zinc-200" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-zinc-200" />
        </div>
        <div className="mt-12 space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-5/6 max-w-xl animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-4 rounded-xl border border-zinc-200 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-200" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}