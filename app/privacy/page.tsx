import Section from '@/components/ui/Section'

export const metadata = {
  title: 'Privacy Policy | ONEFOCUS AFRICA',
  description: 'Privacy policy for ONEFOCUS AFRICA website and services.',
}

export default function PrivacyPage() {
  return (
    <Section background="white" padding="lg">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold text-primary-dark mb-8">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-8">
          <em>Last updated: November 2, 2026</em>
        </p>

        <div className="bg-yellow-100 p-6 rounded-lg mb-8">
          <p className="text-sm text-gray-800">
            ⚠️ <strong>Note:</strong> This is a template privacy policy. Replace with actual legal 
            document reviewed by qualified legal counsel before going live.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          When you submit an inquiry or register for our community, we collect:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Name and contact information</li>
          <li>Company and industry details</li>
          <li>Information about your business needs</li>
          <li>Communication preferences</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">We use collected information to:</p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Respond to your inquiries</li>
          <li>Provide requested services</li>
          <li>Send relevant updates (with your consent)</li>
          <li>Improve our services</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">3. Data Protection</h2>
        <p className="text-gray-700 mb-6">
          We implement appropriate security measures to protect your personal information. Your data 
          is stored securely and accessed only by authorized personnel.
        </p>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">4. Your Rights</h2>
        <p className="text-gray-700 mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Access your personal data</li>
          <li>Request corrections</li>
          <li>Request deletion of your data</li>
          <li>Opt out of communications</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary-dark mt-8 mb-4">5. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          For privacy-related questions or requests:
        </p>
        <p className="text-gray-700">
          Email: <a href="mailto:onefocusafrica@gmail.com" className="text-primary-blue hover:underline">onefocusafrica@gmail.com</a><br />
          Address: Kigali, Rwanda
        </p>
      </div>
    </Section>
  )
}
