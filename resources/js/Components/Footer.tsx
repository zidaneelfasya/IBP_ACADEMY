const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          <div className="flex items-start space-x-4">
            <div className="w-16">
              <img src="/asset/logo.png" alt="IBP Logo" className="w-full h-auto" />
            </div>
            <div>
              <h4 className="font-bold">Industrial Business Project 2025</h4>
              <p className="text-sm opacity-80">Himpunan Mahasiswa Teknik Industri</p>
              <p className="text-sm opacity-80">Fakultas Teknik</p>
              <p className="text-sm opacity-80">Universitas Brawijaya</p>
              <div className="text-xs mt-2 opacity-60">
                Jl. Veteran No. 10-11, Ketawanggede,<br/>
                Kec. Lowokwaru, Kota Malang<br/>
                Jawa Timur 65145
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs">@</span>
              </div>
            </div>
            <p className="text-xs mt-2 opacity-60">bip.joub</p>
            <p className="text-xs opacity-60">ppppcp@gmail.com</p>
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