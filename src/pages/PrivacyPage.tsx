import { SEO } from '../components/SEO';

export function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="Privacy Policy | CreatorAI"
        description="Learn how CreatorAI protects your data, uses cookies, and implements Google AdSense advertisements."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: May 2026</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to CreatorAI. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.</p>
          
          <h2>2. Google AdSense and Third-Party Cookies</h2>
          <p>This website displays Google AdSense advertisements and utilizes third-party cookies for personalized ad delivery. We want our users to fully understand how their browsing data is used in relation to advertising services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google AdSense Advertising:</strong> Google, as a third-party vendor, uses cookies to serve advertisements on CreatorAI.</li>
            <li><strong>Personalized Ads & DART Cookies:</strong> Google's use of advertising cookies (including the DoubleClick DART cookie) enables it and its partners to serve ads to our users based on their visits to CreatorAI and other sites on the Internet.</li>
            <li><strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting external Google settings such as <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary underline">About Ads Info website</a>.</li>
          </ul>
          <p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
          <p>Please note that CreatorAI has no access to or control over these cookies that are used by third-party advertisers.</p>
          
          <h2>3. The Data We Collect About You</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you. This includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Information about how you use our website, tools, and services, collected anonymously through third-party web analytics tools.</li>
            <li><strong>Technical Data:</strong> Your internet protocol (IP) address, browser type and version, time zone setting, operating system, and platform.</li>
            <li><strong>Input Data:</strong> Any textual suggestions or topics you submit to our free tools (e.g. video ideas, scripts, hook ideas), which are processed to generate AI outputs but are not stored in association with your identity.</li>
          </ul>
          
          <h2>4. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our Service, including running our AI productivity suites.</li>
            <li>To compile anonymous traffic metrics and optimize the layout and speed of our website.</li>
            <li>To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you.</li>
          </ul>
          
          <h2>5. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
          
          <h2>6. Third-Party Links</h2>
          <p>This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. We encourage you to read the privacy policy of every website you visit.</p>
          
          <h2>7. Contact Details</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:support@creatorai.com" className="text-primary underline">support@creatorai.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
