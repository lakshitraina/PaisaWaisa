import { companyConfig } from "../../config/company";

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                    <p>
                        Welcome to {companyConfig.name} ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                    <p>
                        We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Personal Data: Name, email address, phone number, and other contact data.</li>
                        <li>Financial Data: Information necessary to process your financial tracking, though we do not store sensitive bank credentials directly.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                    <p>
                        We use personal information collected via our website for a variety of business purposes described below:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>To provide and maintain our Service.</li>
                        <li>To notify you about changes to our Service.</li>
                        <li>To allow you to participate in interactive features of our Service.</li>
                        <li>To provide customer support.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Contact Us</h2>
                    <p>
                        If you have data protection questions, please contact us at:
                    </p>
                    <div className="mt-2 text-muted-foreground">
                        <p>{companyConfig.parentCompany}</p>
                        <p>{companyConfig.contact.email}</p>
                        <p>{companyConfig.contact.address}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
