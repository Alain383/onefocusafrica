'use client'

import { useEffect, useState } from 'react'

export default function DateDisplay({ date }: { date: Date | string }) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleDateString())
  }, [date])

  if (!formattedDate) {
    return <span className="text-gray-400">Loading...</span>
  }

  return <>{formattedDate}</>
}
