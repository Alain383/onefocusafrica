export default function Loading() {
  return (
    <div className="min-h-[60vh] animate-pulse bg-white" role="status" aria-label="Loading page">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="mx-auto h-4 w-32 rounded bg-gray-200" />
        <div className="mx-auto mt-6 h-10 w-2/3 max-w-2xl rounded bg-gray-200" />
        <div className="mx-auto mt-4 h-4 w-1/2 max-w-xl rounded bg-gray-100" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 rounded-[5px] bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
