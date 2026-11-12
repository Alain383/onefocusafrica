import Image from 'next/image'
import Button from '../ui/Button'

export default function Hero() {
  return (
    // Full-viewport cinematic hero — navbar overlays from above (fixed/absolute)
    <section className="relative h-screen min-h-[640px] max-h-[1080px] overflow-hidden -mt-16 lg:-mt-20">

      {/* ── Zoomed-out cinematic image ──
           scale-110 pulls the image slightly back to create a "wide shot" feel.
           object-center keeps the subjects centred in frame.                  */}
      <Image
        src="/images/heroimage.webp"
        alt="Young African professionals collaborating on digital strategy"
        fill
        priority
        quality={95}
        className="object-cover object-center scale-110"
        sizes="100vw"
      />

      {/* ── Cinematic overlay ──
           Full-screen dark vignette: heavier at top (behind nav) and bottom,
           lighter in the centre so the image scene reads through clearly.     */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            /* top band — covers transparent navbar area with more space */
            'linear-gradient(to bottom, rgba(10,18,50,0.75) 0%, rgba(10,18,50,0.08) 28%)',
            /* centre scene — very light so subjects are visible */
            'radial-gradient(ellipse 120% 70% at 50% 55%, rgba(10,18,50,0.18) 0%, rgba(10,18,50,0.55) 100%)',
            /* bottom fade into white next section */
            'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.96) 100%)',
          ].join(', '),
        }}
      />

      {/* ── Left-side text scrim — only behind the copy block ── */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-2/3 lg:w-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to right, rgba(10,18,50,0.62) 0%, rgba(10,18,50,0.30) 60%, transparent 100%)',
        }}
      />

      {/* ── Content — vertically centred with more top spacing ── */}
      <div className="absolute inset-0 z-10 flex items-center pt-32 lg:pt-36">
        <div className="mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl w-full">
          <div className="max-w-2xl">

            {/* Main headline — Rowdies Bold */}
            <h1
              className="text-[2.6rem] md:text-[3.5rem] lg:text-[4.75rem] font-bold text-white mb-5 leading-[1.05] tracking-tight drop-shadow-md"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Make your business easier to{' '}
              <span className="text-[#1F99ED]">find, trust &amp; choose.</span>
            </h1>

            {/* Subheading — Poppins Regular */}
            <p
              className="text-lg md:text-xl text-white/80 mb-10 max-w-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ONEFOCUS brings strategy, cinematic media, web technology and lead capture
              together so attention has somewhere valuable to go.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button href="/contact" variant="primary" size="lg">
                Start a Project
              </Button>
              <a
                href="/work"
                className="inline-flex items-center text-lg font-semibold text-white hover:text-[#1F99ED] transition-colors py-4 px-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Explore Our Work →
              </a>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
