import { companyConfig } from "../../config/company";

export default function CookiePolicy() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6 text-foreground">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. What Are Cookies</h2>
                    <p>
                        Cookies are small text files that are set on your computer or other device when you visit websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
                    <p>
                        {companyConfig.name} uses cookies to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Understand and save user's preferences for future visits.</li>
                        <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
                        <li>Keep you signed in to our service.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Managing Cookies</h2>
                    <p>
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                    </p>
                </section>
            </div>
        </div>
    );
}
