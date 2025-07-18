import { FaQuoteLeft } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function Testimony() {
  const testimonies = [
    {
      message:
        "Harganya bersaing, pilihan pakannya juga lengkap. Saya jadi lebih hemat waktu dan biaya. Sangat cocok untuk peternak seperti saya.",
      name: "Budi Santoso",
      info: "Pembudidaya ikan lele",
    },
    {
      message:
        "Platform ini sangat mudah digunakan dan memberikan banyak insight untuk budidaya ikan.",
      name: "Siti Aminah",
      info: "Pembudidaya ikan nila",
    },
    {
      message:
        "Dengan Optifish, saya bisa menghemat biaya pakan hingga 20%. Sangat direkomendasikan!",
      name: "Ahmad Fauzi",
      info: "Pembudidaya ikan gurame",
    },
    {
      message:
        "Dengan Optifish, saya bisa menghemat biaya pakan hingga 20%. Sangat direkomendasikan!",
      name: "Ahmad Fauzi",
      info: "Pembudidaya ikan gurame",
    },
    {
      message:
        "Dengan Optifish, saya bisa menghemat biaya pakan hingga 20%. Sangat direkomendasikan!",
      name: "Ahmad Fauzi",
      info: "Pembudidaya ikan gurame",
    },
    {
      message:
        "Dengan Optifish, saya bisa menghemat biaya pakan hingga 20%. Sangat direkomendasikan!",
      name: "Ahmad Fauzi",
      info: "Pembudidaya ikan gurame",
    },
  ];

  const displayedTestimonies =
    window.innerWidth >= 1440 // xl breakpoint
      ? testimonies.slice(0, 4)
      : window.innerWidth >= 1024 // lg breakpoint
      ? testimonies.slice(0, 3)
      : testimonies;

  return (
    <div className="mx-13">
      <h1 className="text-2xl font-bold mb-4">
        Testimoni & Cerita Pembudidaya
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedTestimonies.map((testimony, index) => (
          <div
            key={index}
            className="p-4 flex flex-col rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 gap-y-10 justify-between min-h-[30rem]">
            <div className="flex flex-col items-start mb-5 gap-y-5 xl:gap-y-10">
              <FaQuoteLeft className="text-black text-3xl mb-2" />
              <p className="text-black font-[400] text-lg xl:text-xl mb-3">
                {testimony.message}
              </p>
            </div>
            <div className="flex items-center">
              <CgProfile className="text-black text-4xl" />
              <div className="flex flex-col ml-3">
                <h3 className="text-lg font-bold">{testimony.name}</h3>
                <p className="text-sm text-gray-500">{testimony.info}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
