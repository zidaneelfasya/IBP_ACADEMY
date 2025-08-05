import Card from '@/Components/Card';
import CompetitionSection from '@/Components/CompetitionSection';
import Footer from '@/Components/Footer';
import Hero from '@/Components/Hero';
import Navbar from '@/Components/Navbar';
import RecapSection from '@/Components/RecapSection';
import TimelineSection from '@/Components/TimelineSection';



const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <RecapSection />
      <CompetitionSection />
      <TimelineSection />
      <Footer />
    </div>
  );
};

export default App;
