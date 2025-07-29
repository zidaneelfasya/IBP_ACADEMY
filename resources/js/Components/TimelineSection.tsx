import Card from "./Card";

const TimelineSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-12">Timeline</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-96 bg-gray-300"></div>
            
            <div className="space-y-8">
              {[1, 2, 3, 4].map((item, index) => (
                <div key={item} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card>
                      <h4 className="font-bold text-lg mb-2">Phase {item}</h4>
                      <p className="text-gray-600 text-sm">
                        Tahapan kompetisi dengan berbagai kegiatan dan milestone yang harus dicapai peserta.
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        Timeline detail akan diumumkan segera
                      </div>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TimelineSection;