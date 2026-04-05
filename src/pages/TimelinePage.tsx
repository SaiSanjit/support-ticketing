function StubPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <h1 className="text-text-primary font-bold text-2xl tracking-tight">{title}</h1>
      <p className="text-text-secondary text-sm max-w-sm">{description ?? 'Coming soon.'}</p>
    </div>
  )
}

export function TimelinePage() {
  return <StubPage title="Timeline" description="Gantt-style timeline view for project planning." />
}
