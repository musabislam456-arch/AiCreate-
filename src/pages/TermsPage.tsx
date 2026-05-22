import { SEO } from '../components/SEO';

export function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <SEO 
        title="Terms of Service | CreatorAI"
        description="Terms and conditions for using CreatorAI's services and tools."
      />
      <div className="container mx-auto px-4 max-w-4xl py-20">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: June 2026</p>
          <h2>1. Terms</h2>
          <p>By accessing the website at CreatorAI, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on CreatorAI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on CreatorAI's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2>3. Disclaimer</h2>
          <p>The materials on CreatorAI's website are provided on an 'as is' basis. CreatorAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h2>4. Limitations</h2>
          <p>In no event shall CreatorAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CreatorAI's website.</p>
          
          <h2>5. Accuracy of materials</h2>
          <p>The materials appearing on CreatorAI's website could include technical, typographical, or photographic errors. CreatorAI does not warrant that any of the materials on its website are accurate, complete or current. CreatorAI may make changes to the materials contained on its website at any time without notice.</p>
          
          <h2>6. Modifications</h2>
          <p>CreatorAI may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
        </div>
      </div>
    </div>
  );
}
