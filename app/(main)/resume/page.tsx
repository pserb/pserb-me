import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Resume | Paul Serbanescu',
}

export default function Resume() {
    return (
        <main className="container mx-auto min-h-screen p-8 pt-24">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-md text-secondary">paul serbanescu</h2>
                <h1 className="text-4xl font-bold mb-8">Resume</h1>
            </div>
            <iframe className="mx-auto items-center justify-center max-w-5xl" src="paul-serbanescu-resume.pdf" width="100%" height="1000px"></iframe>
        </main>
    )
}