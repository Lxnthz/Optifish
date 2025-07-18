import consult from "../../assets/photos/consult-bg.png"
import calculator from "../../assets/photos/calc-bg.png"
import health from "../../assets/elements/services/health.png"
import calc from "../../assets/elements/services/calculator.png"

export default function Services() {
  return(
    <div className="mx-13 flex flex-col lg:flex-row lg:justify-between lg:gap-x-5">
      <div className="p-2 bg-center bg-no-repeat bg-cover rounded-xl lg:flex-1/2" style={{ backgroundImage: `url(${consult})` }}>
        <div className="border-2 border-white rounded-xl min-h-full">
          <div className="flex flex-col items-start justify-center p-5">
            <img src={health} alt="Health Consultation" className="w-13 h-13 mb-3 xl:w-16 xl:h-16" />
            <h2 className="text-2xl font-bold bg-white rounded-xl py-1 px-3 text-[#04397B] mb-2">Gratis!</h2>
            <p className="text-2xl text-white text-center mb-1 xl:text-3xl">Konsultasi Ahli Budidaya</p>
            <div className="flex flex-col justify-between items-start">
              <p className="text-white text-sm font-[400] mb-13 xl:text-lg">Dapatkan saran dari ahli budidaya ikan kami untuk meningkatkan kesehatan dan produktivitas ikan Anda. Konsultasi gratis untuk semua pelanggan!</p>
              <button className="bg-white text-[#04397B] py-1 px-13 font-[700] rounded-lg xl:text-xl hover:bg-gray-200">Coba Sekarang</button>              
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 bg-center bg-no-repeat bg-cover rounded-xl lg:flex-1/2" style={{ backgroundImage: `url(${calculator})` }}>
        <div className="border-2 border-white rounded-xl min-h-full">
          <div className="flex flex-col items-start justify-center p-5 min-h-full">
            <img src={calc} alt="Health Consultation" className="w-13 h-13 mb-3 xl:w-16 xl:h-16" />
            <h2 className="text-2xl font-bold bg-white rounded-xl py-1 px-3 text-[#F7A446] mb-2">Gratis!</h2>
            <p className="text-2xl text-white text-center mb-1 xl:text-3xl">Kalkulator Pakan Cerdas</p>
            <div className="flex flex-col justify-end items-start">
              <p className="text-white text-sm font-[400] mb-13 xl:text-lg">Hitung kebutuhan pakan ikanmu secara akurat berdasarkan jenis ikan, bobot, dan jumlah tebar. Beli pakan sesuai kebutuhan budidaya tanpa pemborosan!</p>
              <button className="bg-white text-[#F7A446] py-1 px-13 font-[700] rounded-lg xl:text-xl hover:bg-gray-200">Coba Sekarang</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}