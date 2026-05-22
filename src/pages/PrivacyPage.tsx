import { SEO } from '../components/SEO';

export function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="Privacy Policy | CreatorAI"
        description="Learn how CreatorAI protects your data and privacy."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: June 2026</p>
          <h2>1. Introduction</h2>
          <p>Welcome to CreatorAI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
          
          <h2>2. The Data We Collect About You</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you. We only collect data that is necessary to provide our services and improve your experience on our platform.</p>
          
          <h2>3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: 
          - To provide and maintain our Service.
          - To notify you about changes to our Service.
          - To provide customer support.
          - To monitor the usage of our Service.</p>
          
          <h2>4. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
          
          <h2>5. Third-Party Links</h2>
          <p>This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</p>
          
          <h2>6. Contact Details</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at support@creatorai.com.</p>
        </div>
      </div>
    </div>
  );
}
