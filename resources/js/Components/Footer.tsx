const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded">
              <div className="text-lg font-bold">IBP</div>
              <div className="text-xs">25</div>
            </div>
            <div>
              <h4 className="font-bold">Industrial Business Project 2025</h4>
              <p className="text-sm opacity-80">Jurusan Manajemen Teknik Industri</p>
              <p className="text-sm opacity-80">Fakultas Teknik</p>
              <p className="text-sm opacity-80">Universitas Brawijaya</p>
              <div className="text-xs mt-2 opacity-60">
                Jl. Mayjend Haryono 167, Malang<br/>
                Kec. Lowokwaru, Kota Malang<br/>
                Jawa Timur 65145
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs">IG</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs">@</span>
              </div>
            </div>
            <p className="text-xs mt-2 opacity-60">ibp2025@gmail.com</p>
          </div>
        </div>
        
        <div className="border-t border-purple-700 mt-8 pt-4 text-center text-xs opacity-60">
          © 2025 IBP. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;