export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse bg-[#F7F9FC] p-6" role="status" aria-label="Loading admin">
      <div className="mx-auto max-w-7xl">
        <div className="h-7 w-56 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-gray-100" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 rounded-xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="mt-8 h-72 rounded-xl bg-white shadow-sm" />
      </div>
    </div>
  )
}
