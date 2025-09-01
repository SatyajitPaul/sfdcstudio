import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Please read these Terms of Service carefully before using SFDC Studio. Your use of the service constitutes acceptance of these terms.",
  keywords: [
    "SFDC Studio terms",
    "Terms of Service",
    "legal",
    "user agreement",
    "Salesforce tool terms",
  ],
  openGraph: {
    title: "Terms of Service - SFDC Studio",
    description:
      "Legal terms governing your use of SFDC Studio, a modern Salesforce Workbench alternative.",
    url: process.env.NEXT_PUBLIC_APP_URL + "/terms",
    type: "website",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL + "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Terms Content */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Last Updated:{" "}
            {new Date("2025-04-05").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <Card className="p-8 shadow-lg prose dark:prose-invert max-w-none">
          <p>
            These Terms of Service ("Terms") govern your use of{" "}
            <strong>SFDC Studio</strong>, a web-based tool for Salesforce data
            management, SOQL querying, and schema exploration ("Service"). By
            accessing or using SFDC Studio, you agree to be bound by these Terms.
            If you do not agree, please do not use the Service.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li>
              <strong>"SFDC Studio"</strong> refers to the online service
              available at{" "}
              <a href="https://satyajitpaul.github.io/sfdcstudio">
                https://satyajitpaul.github.io/sfdcstudio
              </a>
              .
            </li>
            <li>
              <strong>"You"</strong> means the individual or entity using the
              Service.
            </li>
            <li>
              <strong>"We"</strong>, <strong>"Us"</strong>, or{" "}
              <strong>"Our"</strong> refers to Satyajit Paul, the creator and
              maintainer of SFDC Studio.
            </li>
          </ul>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By logging in, connecting to Salesforce, or otherwise using SFDC
            Studio, you:
          </p>
          <ul>
            <li>
              Confirm that you have read, understood, and agree to these Terms;
            </li>
            <li>
              If using on behalf of an organization, represent that you have the
              authority to bind that organization to these Terms.
            </li>
          </ul>

          <h2>3. Description of Service</h2>
          <p>
            SFDC Studio is a free, open-source-inspired, browser-based tool
            designed to simplify Salesforce data operations such as SOQL queries,
            data loading, and metadata exploration. It is{" "}
            <strong>not an official Salesforce product</strong> and is not
            affiliated with, endorsed by, or supported by Salesforce, Inc.
          </p>

          <h2>4. Use of the Service</h2>
          <p>You agree to use SFDC Studio only for lawful purposes and in accordance with these Terms. You must not:</p>
          <ul>
            <li>Use the Service to violate any applicable laws or regulations;</li>
            <li>Transmit spam, malware, or harmful content;</li>
            <li>Attempt to reverse engineer, decompile, or disassemble the Service;</li>
            <li>Use the Service to build a competing product or service;</li>
            <li>Access Salesforce data without proper authorization;</li>
            <li>Interfere with the operation of the Service or Salesforce APIs.</li>
          </ul>

          <h2>5. Your Responsibilities</h2>
          <p>You are solely responsible for:</p>
          <ul>
            <li>The accuracy and legality of any data accessed or modified via SFDC Studio;</li>
            <li>Maintaining the security of your Salesforce credentials and session;</li>
            <li>Compliance with Salesforce's Acceptable Use and Developer Terms;</li>
            <li>Ensuring your use does not violate Salesforce's API rate limits or terms.</li>
          </ul>

          <h2>6. No Warranty</h2>
          <p>
            The Service is provided <strong>"as-is" and "as available"</strong>{" "}
            without warranties of any kind, either express or implied. We
            expressly disclaim all warranties, including but not limited to
            merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>
          <p>
            SFDC Studio may experience outages, bugs, or inaccuracies. We make no
            guarantees about uptime, reliability, or data integrity.
          </p>

          <h2>7. No Liability</h2>
          <p>
            In no event shall Satyajit Paul, the creator of SFDC Studio, be
            liable for any direct, indirect, incidental, special, or
            consequential damages arising from your use of or inability to use
            the Service, including but not limited to data loss, downtime, or
            business interruption.
          </p>
          <p>Your use of SFDC Studio is at your own risk.</p>

          <h2>8. Intellectual Property</h2>
          <p>
            All rights, title, and interest in and to SFDC Studio, including
            source code, design, and branding, are owned by Satyajit Paul. These
            Terms do not grant you any license to use our trademarks or
            intellectual property except as necessary to use the Service.
          </p>
          <p>
            The Service may use open-source libraries. You are responsible for
            complying with their respective licenses.
          </p>

          <h2>9. Termination</h2>
          <p>
            We reserve the right to suspend or discontinue access to SFDC Studio
            at any time, with or without notice. You may stop using the Service
            at any time.
          </p>

          <h2>10. Third-Party Services</h2>
          <p>
            SFDC Studio integrates with Salesforce via OAuth and APIs. Your use
            of Salesforce services is governed by Salesforce's{" "}
            <a
              href="https://www.salesforce.com/company/legal/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="https://www.salesforce.com/company/legal/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            . We are not responsible for Salesforce's systems, data, or policies.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The updated version will
            be posted on this page with a new "Last Updated" date. Continued use
            of the Service after changes constitutes acceptance.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, without regard to
            conflict of law principles. Any disputes arising from or related to
            these Terms shall be resolved in the courts located in West Bengal,
            India.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:satyajit.sf@gmail.com"
              className="text-primary hover:underline"
            >
              satyajit.sf@gmail.com
            </a>
            .
          </p>
        </Card>
      </div>
      <footer className="mt-12 text-center">
        <Button variant="link" asChild>
            <Link href="/">← Back to Home</Link>
        </Button>
       </footer>
    </div>
  );
}