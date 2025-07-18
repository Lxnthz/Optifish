import Bronze from "../../assets/elements/Progress/CrownBronze.svg"

export default function MemberProgress() {
  const currentPoints = 500; // Example current points, replace with actual data
  const nextLevelPoints = 1000; // Example points needed for next level, replace
  const progressPercentage = (currentPoints / nextLevelPoints) * 100;

  return (
    <div className="mx-13 p-1 rounded-xl gap-x-3 bg-gradient-to-b from-[#CD7F32] to-[#674019]">
      <div className="flex h-full w-full bg-white px-7 py-4 rounded-lg">
        <div className="flex flex-col items-start gap-y-1 flex-1/16 max-w-[200px] xl:max-w-[250px]">
          <div className="flex items-center gap-x-2">
            <img src={Bronze} alt="Bronze Crown" />
            <p className="text-transparent bg-clip-text bg-gradient-to-b from-[#CD7F32] to-[#674019] font-[700] xl:text-xl">Bronze</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xl font-[700] xl:text-2xl">Tingkatkan Poin Membership Anda!</p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xs font-[400] text-gray-500 xl:text-sm">Untuk Membuka Bonus dan Banyak Promo Lainnya</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 flex-1/2 w-full justify-center">
          <p className="text-xl text-left xl:text-2xl">{currentPoints} Poin</p>
          <div className="w-full bg-[#67401977] rounded-full h-2">
            <div className="bg-gradient-to-r from-[#CD7F32] to-[#674019] h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-right font-[400] text-sm xl:text-lg"><span className="font-bold">{nextLevelPoints - currentPoints}</span> Poin lagi untuk naik ke <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#C0C0C0] to-[#A0A0A0] font-[700]">Silver</span></p>
        </div>
      </div>
    </div>
  );
}