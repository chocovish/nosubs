import { BrandHeader } from '@/components/header/brand-header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p>At noSubs, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
              <p>We may collect several types of information from and about users of our platform, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Personal identifiers such as name, email address, and payment information</li>
                <li>Profile information you provide when creating an account</li>
                <li>Information about transactions you complete on our platform</li>
                <li>Usage data about how you interact with our platform</li>
                <li>Device information such as IP address, browser type, and operating system</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Providing, maintaining, and improving our platform</li>
                <li>Processing transactions and sending related information</li>
                <li>Responding to your requests, questions, and feedback</li>
                <li>Personalizing your experience on our platform</li>
                <li>Communicating with you about products, services, and events</li>
                <li>Protecting our platform and users</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. How We Share Your Information</h2>
              <p>We may share your personal information in the following situations:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>With other users as necessary to facilitate transactions (e.g., sharing a seller's information with a buyer)</li>
                <li>With third-party service providers who perform services on our behalf</li>
                <li>To comply with law, regulation, legal process, or governmental request</li>
                <li>In connection with a merger, sale, or acquisition of all or a portion of our company</li>
                <li>With your consent or at your direction</li>
              </ul>
              <p className="mt-3">noSubs does not sell your personal information to third parties.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission is completely secure, and we cannot guarantee the security of information transmitted to or from our platform.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Privacy Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Accessing or receiving a copy of your information</li>
                <li>Correcting inaccurate information</li>
                <li>Deleting your information</li>
                <li>Restricting or objecting to certain processing activities</li>
              </ul>
              <p className="mt-3">To exercise these rights, please contact us using the information provided in the "Contact Information" section.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Content Reporting</h2>
              <p>If you believe any content on our platform violates our policies, infringes upon intellectual property rights, or is otherwise illegal, please report it to <a href="mailto:vishal.ghosh28@gmail.com" className="text-blue-600 hover:underline">vishal.ghosh28@gmail.com</a> with detailed information about the violation.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
              <p>If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at <a href="mailto:vishal.ghosh28@gmail.com" className="text-blue-600 hover:underline">vishal.ghosh28@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 