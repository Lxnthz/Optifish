import { useState } from "react";

const calculators = [
  {
    id: "fish_estimation",
    title: "Estimasi Jumlah Ikan",
    description:
      "Menghitung estimasi jumlah ikan berdasarkan luas kolam dan kepadatan tebar.",
    component: () => {
      const [luasKolam, setLuasKolam] = useState();
      const [kepadatanTebar, setKepadatanTebar] = useState();

      // Calculate the result
      let jumlahIkan = luasKolam * kepadatanTebar;
      if( jumlahIkan < 0 || isNaN(jumlahIkan) ) {
        jumlahIkan = 0;
      } 

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Estimasi Jumlah Ikan
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan sesuai Input tiap kolomnya
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={luasKolam}
                  onChange={(e) => setLuasKolam(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Luas Kolam (m²)"
                />
              </label>
              <label className="text-sm mb-1">
                <input
                  type="number"
                  value={kepadatanTebar}
                  onChange={(e) => setKepadatanTebar(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Kepadatan Tebar (ekor/m²)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Jumlah Ikan: {jumlahIkan} ekor
                </p>
              </div>
              <p className="hidden md:flex w-full font-[400] text-xs text-center">
                Jumlah ikan adalah {jumlahIkan} ekor, berdasarkan luas kolam{" "}
                {luasKolam} m² dan kepadatan tebar {kepadatanTebar} ekor/m².
              </p>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "biomass",
    title: "Estimasi Biomassa Awal",
    description:
      "Menghitung total bobot ikan dalam kolam berdasarkan bobot rata-rata dan jumlah ikan.",
    component: () => {
      const [jumlahIkan, setJumlahIkan] = useState();
      const [beratRataRata, setBeratRataRata] = useState();

      // Calculate the biomass
      let biomass = jumlahIkan * beratRataRata;
      if( biomass < 0 || isNaN(biomass) ) {
        biomass = 0;
      }

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Estimasi Biomassa Awal
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan sesuai Input tiap kolomnya
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={jumlahIkan}
                  onChange={(e) => setJumlahIkan(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Ikan (ekor)"
                />
              </label>
              <label className="text-sm mb-1">
                <input
                  type="number"
                  value={beratRataRata}
                  onChange={(e) => setBeratRataRata(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Bobot Rataan Benih (kg)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Total Biomassa: {biomass} kg
                </p>
              </div>
              <p className="hidden md:flex w-full font-[400] text-xs text-center">
                Total biomassa ikan adalah {biomass} kg, berdasarkan jumlah ikan{" "}
                {jumlahIkan} ekor dan bobot rata-rata {beratRataRata} kg.
              </p>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "daily-food",
    title: "Kebutuhan Pakan Harian",
    description:
      "Menghitung kebutuhan pakan harian berdasarkan biomassa dan rasio pemberian pakan.",
    component: () => {
      const [biomass, setBiomass] = useState("");
      const [feedingRatio, setFeedingRatio] = useState("");

      // Calculate daily food requirement
      let dailyFood = biomass * (feedingRatio / 100);
      if (dailyFood < 0 || isNaN(dailyFood)) {
        dailyFood = 0;
      }

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Kebutuhan Pakan Harian
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan biomassa dan rasio pemberian pakan
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={biomass}
                  onChange={(e) => setBiomass(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Biomassa (kg)"
                />
              </label>
              <label className="text-sm mb-1">
                <input
                  type="number"
                  value={feedingRatio}
                  onChange={(e) => setFeedingRatio(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Rasio Pemberian Pakan (%)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Kebutuhan Pakan Harian: {dailyFood.toFixed(2)} kg
                </p>
              </div>
              <p className="hidden md:flex w-full font-[400] text-xs text-center">
                Kebutuhan pakan harian adalah {dailyFood.toFixed(2)} kg,
                berdasarkan biomassa {biomass} kg dan rasio pemberian pakan{" "}
                {feedingRatio}%.
              </p>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "total-feed",
    title: "Total Kebutuhan Pakan",
    description:
      "Menghitung total pakan berdasarkan biomassa dan feeding rate harian.",
    component: () => {
      const [entries, setEntries] = useState([{ biomassa: null, feedingRate: null }]);

      const addEntry = () => {
        setEntries([...entries, { biomassa: null, feedingRate: null }]);
      };

      const updateEntry = (index, field, value) => {
        const updated = [...entries];
        updated[index][field] = Number(value);
        setEntries(updated);
      };

      const totalPakan = entries.reduce(
        (total, item) => total + item.biomassa * (item.feedingRate / 100),
        0
      );

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex flex-col items-center w-full">
            <p className="text-[1rem] font-[500] text-center mb-1">
              Total Kebutuhan Pakan
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Tambahkan data biomassa dan feeding rate harian
            </p>

            <form className="flex flex-col gap-y-3 w-full">
              {entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-y-2 items-start w-full border-b border-gray-300 pb-3">
                  {/* Day Indicator */}
                  <p className="text-sm font-[500] text-gray-700">
                    Hari ke-{idx + 1}
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`Biomassa hari ke-${idx + 1} (kg)`}
                    value={entry.biomassa}
                    onChange={(e) =>
                      updateEntry(idx, "biomassa", e.target.value)
                    }
                    className="rounded-lg text-sm py-2 px-4 items-center w-full border font-[400] border-black/20"
                  />
                  <input
                    type="number"
                    step="0.001"
                    placeholder={`Feeding rate ke-${idx + 1} (%)`}
                    value={entry.feedingRate}
                    onChange={(e) =>
                      updateEntry(idx, "feedingRate", e.target.value)
                    }
                    className="rounded-lg text-sm py-2 px-4 items-center w-full border font-[400] border-black/20"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addEntry}
                className="text-white bg-[#9A7C00] hover:bg-[#CAA300] px-4 py-2 rounded-lg mt-2">
                Tambah Hari
              </button>

              <p className="text-xs font-[400] text-center mt-4">
                Hasilnya adalah:
              </p>

              <div className="border border-black/20 rounded-lg px-4 py-2 text-center">
                <p className="text-sm font-[500]">
                  Total Kebutuhan Pakan: {totalPakan.toFixed(2)} kg
                </p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "specific-growth-rate",
    title: "Specific Growth Rate (SGR)",
    description:
      "Menghitung tingkat pertumbuhan spesifik ikan berdasarkan berat awal, berat akhir, dan banyak hari.",
    component: () => {
      const [beratAwal, setBeratAwal] = useState('');
      const [beratAkhir, setBeratAkhir] = useState('');
      const [banyakHari, setBanyakHari] = useState('');

      // Calculate SGR
      const sgr =
        banyakHari > 0
          ? ((beratAkhir - beratAwal) / banyakHari) * 100
          : 0;

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Specific Growth Rate (SGR)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan berat awal, berat akhir, dan banyak hari
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={beratAwal}
                  onChange={(e) => setBeratAwal(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Berat Awal Ikan (kg)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={beratAkhir}
                  onChange={(e) => setBeratAkhir(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Berat Akhir Ikan (kg)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={banyakHari}
                  onChange={(e) => setBanyakHari(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Banyak Hari"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Specific Growth Rate: {sgr.toFixed(2)} %/hari
                </p>
              </div>
              <p className="hidden md:flex w-full font-[400] text-xs text-center">
                Tingkat pertumbuhan spesifik adalah {sgr.toFixed(2)} %/hari,
                berdasarkan berat awal {beratAwal} kg, berat akhir {beratAkhir} kg,
                dan banyak hari {banyakHari}.
              </p>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "protein-efficiency-ratio",
    title: "Protein Efficiency Ratio (PER)",
    description:
      "Menghitung efisiensi protein berdasarkan pertambahan berat badan ikan dan jumlah protein.",
    component: () => {
      const [weightGain, setWeightGain] = useState("");
      const [proteinAmount, setProteinAmount] = useState("");

      const per = proteinAmount > 0 ? weightGain / proteinAmount : 0;

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Protein Efficiency Ratio (PER)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan pertambahan berat badan ikan dan jumlah protein
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={weightGain}
                  onChange={(e) => setWeightGain(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Pertambahan Berat Badan Ikan (g)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={proteinAmount}
                  onChange={(e) => setProteinAmount(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Protein (g)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">PER: {per.toFixed(2)}</p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "feed-conversion-rate",
    title: "Feed Conversion Rate (FCR)",
    description:
      "Menghitung rasio konversi pakan berdasarkan total pakan yang diberikan dan total pertambahan bobot ikan.",
    component: () => {
      const [totalFeed, setTotalFeed] = useState();
      const [weightGain, setWeightGain] = useState();

      const fcr = weightGain > 0 ? totalFeed / weightGain : 0;

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Feed Conversion Rate (FCR)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan total pakan yang diberikan dan total pertambahan bobot ikan
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={totalFeed}
                  onChange={(e) => setTotalFeed(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Total Pakan yang Diberikan (kg)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={weightGain}
                  onChange={(e) => setWeightGain(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Total Pertambahan Bobot Ikan (kg)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">FCR: {fcr.toFixed(2)}</p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "cost-per-gain",
    title: "Biaya per Kenaikan Bobot Ikan",
    description:
      "Menghitung biaya per pertambahan berat badan ikan berdasarkan FCR dan harga pakan.",
    component: () => {
      const [fcr, setFcr] = useState();
      const [feedCost, setFeedCost] = useState();

      let costPerGain = fcr * feedCost;
      if (costPerGain < 0 || isNaN(costPerGain)) {
        costPerGain = 0;
      }

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">Biaya per Kenaikan Bobot Ikan</p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan FCR dan harga pakan per kg
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={fcr}
                  onChange={(e) => setFcr(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Feed Conversion Rate (FCR)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={feedCost}
                  onChange={(e) => setFeedCost(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Harga Pakan per kg (Rupiah)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Cost Per Gain: Rp {costPerGain.toFixed(2)}
                </p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "daily-feeding-rate",
    title: "Daily Feeding Rate (DFR)",
    description:
      "Menghitung rasio pemberian pakan harian berdasarkan persentase pakan harian dan biomassa total.",
    component: () => {
      const [dailyPercentage, setDailyPercentage] = useState();
      const [biomass, setBiomass] = useState();

      let dfr = (dailyPercentage * biomass) / 100;
      if (dfr < 0 || isNaN(dfr)) {
        dfr = 0;
      }

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Daily Feeding Rate (DFR)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan persentase pakan harian dan biomassa total
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={dailyPercentage}
                  onChange={(e) => setDailyPercentage(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Persentase Pakan Harian (%)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={biomass}
                  onChange={(e) => setBiomass(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Biomass Total (kg)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">DFR: {dfr.toFixed(2)} kg</p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "total-feed-requirement",
    title: "Kebutuhan Pakan Total",
    description:
      "Menghitung kebutuhan pakan total berdasarkan jumlah ikan, berat rata-rata ikan, persentase pakan harian, dan jumlah hari.",
    component: () => {
      const [jumlahIkan, setJumlahIkan] = useState();
      const [beratRata, setBeratRata] = useState();
      const [dailyPercentage, setDailyPercentage] = useState();
      const [jumlahHari, setJumlahHari] = useState();

      let totalFeed =
        jumlahIkan * beratRata * (dailyPercentage / 100) * jumlahHari;
      if (totalFeed < 0 || isNaN(totalFeed)) {
        totalFeed = 0;
      }

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Kebutuhan Pakan Total
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan jumlah ikan, berat rata-rata ikan, persentase pakan harian,
              dan jumlah hari
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={jumlahIkan}
                  onChange={(e) => setJumlahIkan(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Ikan"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={beratRata}
                  onChange={(e) => setBeratRata(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Berat Rata Ikan (kg)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={dailyPercentage}
                  onChange={(e) => setDailyPercentage(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Persentase Pakan Harian (%)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={jumlahHari}
                  onChange={(e) => setJumlahHari(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Hari"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">
                  Total Kebutuhan Pakan: {totalFeed.toFixed(2)} kg
                </p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "survival-rate",
    title: "Survival Rate (SR)",
    description:
      "Menghitung tingkat kelangsungan hidup ikan berdasarkan jumlah ikan awal dan akhir.",
    component: () => {
      const [jumlahIkanAwal, setJumlahIkanAwal] = useState();
      const [jumlahIkanAkhir, setJumlahIkanAkhir] = useState();

      const sr =
        jumlahIkanAwal > 0
          ? (jumlahIkanAkhir / jumlahIkanAwal) * 100
          : 0;

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Survival Rate (SR)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan jumlah ikan awal dan jumlah ikan akhir
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={jumlahIkanAwal}
                  onChange={(e) => setJumlahIkanAwal(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Ikan Awal"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={jumlahIkanAkhir}
                  onChange={(e) => setJumlahIkanAkhir(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Jumlah Ikan Akhir"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">SR: {sr.toFixed(2)}%</p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
  {
    id: "growth-performance-index",
    title: "Growth Performance Index (GPI)",
    description:
      "Menghitung indeks performa pertumbuhan berdasarkan SGR dan tingkat kelangsungan hidup.",
    component: () => {
      const [sgr, setSgr] = useState();
      const [survivalRate, setSurvivalRate] = useState();

      const gpi = (sgr * survivalRate) / 100;

      return (
        <div className="md:bg-gradient-to-r from-[#CAA300] to-[#9A7C00] p-[2px] rounded-lg flex">
          <div className="bg-white p-1 rounded-md md:p-5 flex items-center justify-center flex-col min-w-full">
            <p className="text-[1rem] font-[500] text-center">
              Growth Performance Index (GPI)
            </p>
            <p className="text-xs font-[400] mb-3 text-center">
              Masukkan SGR dan tingkat kelangsungan hidup
            </p>
            <form className="flex flex-col gap-y-2 w-[90%] md:w-full">
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={sgr}
                  onChange={(e) => setSgr(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Specific Growth Rate (SGR)"
                />
              </label>
              <label className="text-sm min-w-full">
                <input
                  type="number"
                  value={survivalRate}
                  onChange={(e) => setSurvivalRate(Number(e.target.value))}
                  className="rounded-lg py-2 px-4 min-w-full items-center flex justify-center border font-[400] border-black/20"
                  placeholder="Survival Rate (%)"
                />
              </label>
              <p className="text-xs font-[400] mb-1 text-center">
                Hasilnya adalah:
              </p>
              <div className="border-black/20 border-1 rounded-lg py-2 px-4 text-center">
                <p className="text-sm font-[500]">GPI: {gpi.toFixed(2)}</p>
              </div>
            </form>
          </div>
        </div>
      );
    },
  },
];

export default calculators;
