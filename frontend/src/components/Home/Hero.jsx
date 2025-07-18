import hero from '../../assets/photos/hero-banner.png'

export default function Hero() {
  return (
    <div className="min-h-[80vh] flex flex-col px-13 items-end justify-center bg-cover bg-left bg-no-repeat text-white" style={{ backgroundImage: `url(${hero})` }}>
      <div className='flex flex-col'>
        <h1 className="text-3xl font-bold mb-4 flex flex-col items-end xl:text-5xl">
          <span>Platform Manajemen Pakan dan</span>
          <span>Kesehatan Nomor 1 di Indonesia!</span>
        </h1>
        <p className="text-xl mb-6 font-[400] xl:text-2xl text-right">Solusi Cerdas untuk Semua Kebutuhan Budidaya Ikan Anda</p>
      </div>
      <div className='flex gap-x-5'>
        <button onClick={() => window.location.href="/produk"} className='font-[400] bg-white text-[#04397B] py-2 px-10 rounded-lg hover:cursor-pointer'>Mulai Belanja</button>
        <button onClick={() => window.location.href="/kalkulator"} className='font-[400] bg-white text-[#04397B] py-2 px-6 rounded-lg hover:cursor-pointer'>Hitung Kebutuhan Pakan</button>
      </div>
    </div>
  )
}