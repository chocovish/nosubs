import { BrandHeader } from '@/components/header/brand-header';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <BrandHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p>Welcome to noSubs. These Terms and Conditions govern your use of our platform and services. By accessing or using noSubs, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Platform Overview</h2>
              <p>noSubs operates as an aggregator platform that connects digital product sellers with buyers. We do not sell or create the products offered on our platform. We simply provide the technology and services to facilitate transactions between users.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Seller Obligations</h2>
              <p>As a seller on noSubs, you are obligated to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Only sell digital products for which you possess legitimate ownership rights or proper authorization to sell.</li>
                <li>Refrain from selling any illegal, harmful, offensive, or unauthorized content.</li>
                <li>Provide accurate descriptions of your products.</li>
                <li>Fulfill all orders promptly and as described.</li>
                <li>Comply with all applicable laws and regulations.</li>
              </ul>
              <p className="mt-3">noSubs reserves the right to remove any content that violates these terms or that we reasonably believe may create liability.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Prohibited Content</h2>
              <p>The following content is strictly prohibited on noSubs:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Content that infringes on intellectual property rights</li>
                <li>Malware, viruses, or harmful code</li>
                <li>Illegal goods or services</li>
                <li>Content that promotes or glorifies hatred, violence, or discrimination</li>
                <li>Sexually explicit or pornographic material</li>
                <li>Personal data sold without proper consent</li>
                <li>Any other content that violates laws or regulations</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Buyer Responsibilities</h2>
              <p>As a buyer on noSubs:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You are responsible for evaluating the suitability of any product before purchase.</li>
                <li>You accept full responsibility for your purchases and their use.</li>
                <li>You acknowledge that noSubs is not the creator or seller of the products and has no control over their quality or content.</li>
                <li>You agree to use purchased content in accordance with applicable laws and the terms set by the seller.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Reporting Violations</h2>
              <p>If you encounter content that violates these terms or appears to be illegal, we encourage you to report it immediately. Please email detailed information about the violation to <a href="mailto:vishal.ghosh28@gmail.com" className="text-blue-600 hover:underline">vishal.ghosh28@gmail.com</a>.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Limitation of Liability</h2>
              <p>noSubs serves solely as a platform connecting buyers and sellers. We do not create, review, or endorse any of the content sold on our platform. As such:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>We are not responsible for the quality, safety, or legality of items sold.</li>
                <li>We make no warranties about the accuracy or reliability of content on our platform.</li>
                <li>In no event shall noSubs be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Amendments to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and potentially via email. Your continued use of the platform after such changes constitutes your acceptance of the new terms.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
              <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:vishal.ghosh28@gmail.com" className="text-blue-600 hover:underline">vishal.ghosh28@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 