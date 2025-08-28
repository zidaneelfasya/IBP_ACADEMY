import Card from "@/Components/Card";
import Footer from "@/Components/Footer";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import RecapSection from "@/Components/RecapSection";
import SEOWrapper from "@/Components/SEOWrapper";
import TimelineSection from "@/Components/TimelineSection";
import { Head } from "@inertiajs/react";

const App: React.FC = () => {
    return (
        <>
            <Head>
                <title>IBP ACADEMY</title>
                <meta
                    name="description"
                    content="IBP (Industrial Business Project) 2025 is an international competition and innovation platform organized by the Business and Entrepreneurship Department of the Industrial Engineering Student Association at Universitas Brawijaya. As a medium for education and talent incubation, IBP aims to provide a comprehensive experience in the future world of industry and entrepreneurship through the implementation of the SDGs."
                />
                <meta property="og:title" content="IBP ACADEMY" />
                <meta
                    property="og:description"
                    content="IBP (Industrial Business Project) 2025 is an international competition and innovation platform organized by the Business and Entrepreneurship Department of the Industrial Engineering Student Association at Universitas Brawijaya. As a medium for education and talent incubation, IBP aims to provide a comprehensive experience in the future world of industry and entrepreneurship through the implementation of the SDGs."
                />
            </Head>
            <SEOWrapper
                title="Industrial Business Project Academy"
                description="IBP (Industrial Business Project) 2025 is an international competition and innovation platform organized by the Business and Entrepreneurship Department of the Industrial Engineering Student Association at Universitas Brawijaya. As a medium for education and talent incubation, IBP aims to provide a comprehensive experience in the future world of industry and entrepreneurship through the implementation of the SDGs."
                image="/eb"
            >
                <div className="min-h-screen">
                    <Navbar />
                    <Hero />
                    <RecapSection />
                    <TimelineSection />
                    <Footer />
                </div>
            </SEOWrapper>
        </>
    );
};

export default App;
