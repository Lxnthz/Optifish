import { useState } from "react";
import backgroundImage from "../assets/photos/calc-bg-long.png";
import calc from "../assets/elements/services/calculator.png";
import calculators from "../components/Calculator/dataCalculator.jsx"; // Import the calculator data

export default function Calculator() {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center lg:mt-13 lg:mx-13 mx-5">
      <div className="flex flex-col items-center lg:mt-10 mt-5 min-w-full">
        {/* Header */}
        <div
          className="flex items-center justify-center min-h-full bg-right bg-cover bg-no-repeat rounded-xl min-w-full"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="m-2 w-full px-4 gap-y-2 py-4 flex flex-col md:flex-row lg:px-5 lg:py-3 border-2 border-white rounded-xl">
            <div className="flex md:items-center md:justify-center">
              <img src={calc} alt="Calculator" className="w-10 md:w-15 lg:w-20" />
            </div>
            <div className="flex flex-col items-start justify-center md:ml-4 gap-y-1">
              <p className="text-md md:text-xl lg:text-2xl text-white">
                Kalkulator Pakan Cerdas
              </p>
              <p className="text-white text-xs font-[400] md:text-sm">
                Silakan pilih jenis perhitungan yang ingin Anda lakukan untuk
                mendukung budidaya ikan Anda. Kalkulator akan muncul di panel
                sebelah kanan.
              </p>
            </div>
          </div>
        </div>
        {/* Calculator */}
        <div className="flex gap-x-5 w-full mt-5">
          {/* Sidebar in Desktop, Dropdown on Mobile */}
          <div className="flex flex-col w-full lg:w-[70%]">
            {calculators.map((calculator) => (
              <div key={calculator.id} className="flex flex-col">
                <div
                  className={`py-4 px-3 rounded-xl mb-3 cursor-pointer transition-all duration-200 ${
                    selectedCalculator?.id === calculator.id
                      ? "shadow-xl bg-gradient-to-b from-[#d3b53b] to-[#fdde5f]"
                      : "inset-shadow-sm shadow-sm"
                  }`}
                  onClick={() =>
                    setSelectedCalculator(
                      selectedCalculator?.id === calculator.id
                        ? null
                        : calculator
                    )
                  }
                >
                  <p
                    className={`text-lg font-bold transition-all duration-200 ${
                      selectedCalculator?.id === calculator.id
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {calculator.title}
                  </p>
                  <p className="text-sm text-black font-[400]">
                    {calculator.description}
                  </p>
                </div>
                {/* Mobile Viewer: Render calculator directly under the selected menu */}
                <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                    selectedCalculator?.id === calculator.id
                      ? "max-h-screen opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-white p-3 rounded-lg shadow-lg">
                    {selectedCalculator?.component && (
                      <selectedCalculator.component />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Viewer */}
          <div
            className={`hidden md:block md:min-w-[50%] h-fit lg:max-w-[30%] bg-white p-3 rounded-lg shadow-lg transition-opacity duration-300 ${
              selectedCalculator ? "opacity-100" : "opacity-50"
            }`}
          >
            {selectedCalculator?.component && <selectedCalculator.component />}
          </div>
        </div>
      </div>
    </div>
  );
}
