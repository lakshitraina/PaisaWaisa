import { companyConfig } from "../../config/company";

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and {companyConfig.parentCompany} doing business as {companyConfig.name} ("we," "us" or "our"), concerning your access to and use of the website and services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Intellectual Property Rights</h2>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. User Representations</h2>
                    <p>
                        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Contact Information</h2>
                    <p>
                        Questions about the Terms of Service should be sent to us at {companyConfig.contact.email}.
                    </p>
                </section>
            </div>
        </div>
    );
}
