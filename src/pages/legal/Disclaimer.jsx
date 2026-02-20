import { companyConfig } from "../../config/company";

export default function Disclaimer() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Website Disclaimer</h2>
                    <p>
                        The information provided by {companyConfig.name} ("we," "us," or "our") on this website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Financial Disclaimer</h2>
                    <p>
                        The Site contains financial information and is intended for informational and educational purposes only. It is not intended as a substitute for professional financial advice. Before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of financial advice.
                    </p>
                    <p className="mt-2 font-medium text-red-500">
                        THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE IS SOLELY AT YOUR OWN RISK.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. External Links Disclaimer</h2>
                    <p>
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                    </p>
                </section>
            </div>
        </div>
    );
}
