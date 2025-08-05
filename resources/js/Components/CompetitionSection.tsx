

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-[#082380] text-center mb-4">Competition</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Business Plan Competition Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
              <h3 className="text-2xl font-bold text-white text-center">Business Plan Competition (BPC)</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
              </p>
              <div className="text-center">
                <button className="bg-[#082380] text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                  More Information
                </button>
              </div>
            </div>
          </div>
          
          {/* Business Case Competition Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
              <h3 className="text-2xl font-bold text-white text-center">Business Case Competition (BCC)</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere.
              </p>
              <div className="text-center">
                <button className="bg-[#082380] text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                  More Information
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionSection;