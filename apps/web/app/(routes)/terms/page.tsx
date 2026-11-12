import Section from '@/components/ui/Section'

export const metadata = {
  title: 'Terms of Service | ONEFOCUS AFRICA',
  description: 'Terms of service for ONEFOCUS AFRICA website and services.',
}

export default function TermsPage() {
  return (
    <Section background="white" padding="lg">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-primary-dark mb-8">Terms of Service</h1>
        
        <p className="text-gray-600 mb-8">
          <em>Last updated: November 2, 2026</em>
        </p>

        <div className="bg-yellow-100 p-6 rounded-lg mb-8">
          <p className="text-sm text-gray-800">
            ⚠️ <strong>Note:</strong> This is a template terms of service. Replace with actual legal 
            document reviewed by qualified legal counsel before going live.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">1. Services</h2>
        <p className="text-gray-700 mb-6">
          ONEFOCUS AFRICA provides business growth services including brand strategy, media production, 
          web development, and talent development. Specific deliverables are defined in project agreements.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">2. Project Scope</h2>
        <p className="text-gray-700 mb-6">
          All projects are quoted based on defined scope. Changes to scope may affect timeline and pricing. 
          We do not guarantee specific business results, sales figures, or ROI.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">3. Intellectual Property</h2>
        <p className="text-gray-700 mb-6">
          Upon full payment, clients receive agreed-upon usage rights to deliverables. ONEFOCUS retains 
          the right to showcase work in portfolios with client permission.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">4. Payment Terms</h2>
        <p className="text-gray-700 mb-6">
          Payment terms are specified in individual project agreements. Typical structure includes 
          deposit before work begins and final payment upon completion.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="text-gray-700 mb-6">
          ONEFOCUS AFRICA's liability is limited to the fees paid for services. We are not liable for 
          indirect, incidental, or consequential damages.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">6. Contact</h2>
        <p className="text-gray-700">
          Questions about these terms:<br />
          Email: <a href="mailto:onefocusafrica@gmail.com" className="text-primary-blue hover:underline">onefocusafrica@gmail.com</a><br />
          WhatsApp: +250 781 102 667<br />
          Address: Kigali, Rwanda
        </p>
      </div>
    </Section>
  )
}
