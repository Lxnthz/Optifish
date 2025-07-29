import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import FooterBG from '../assets/photos/footer-bg.png';
import Logo from '../assets/elements/logo-optifish-white.png'
import GroupPay from '../assets/elements/Payment/group-payment.png';
import GroupExpedition from '../assets/elements/Expedition/group-expedition.png';


export default function Footer() {
  return (
    <footer className="rounded-t-2xl pt-5 flex bg-center bg-cover md:pt-10" style={{ backgroundImage: `url(${FooterBG})` }} >
      <div className="flex-col mx-5 py-5 items-start gap-y-5 md:flex-row md:mx-13 md:py-10 flex md:gap-x-5 md:justify-between">
        <div className='flex flex-col md:items-start md:justify-center gap-y-2 md:flex-1/4'>
          <img src={Logo} alt="Optifish Logo" className="w-30 lg:w-30 xl:w-40" />
          <p className='text-white font-light text-xs xl:text-lg'>Platform digital untuk manajemen pakan dan kesehatan ikan, solusi cerdas bagi pembudidaya di seluruh Indonesia.</p>
          <div className="flex gap-x-3">
            <a href="https://www.instagram.com/optifish.id/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FaInstagram className="w-6 h-6 lg:w-10 lg:h-10" />
            </a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FaWhatsapp className="w-6 h-6 lg:w-10 lg:h-10" />
            </a>
            <a href="https://www.youtube.com/@optifish.id" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
              <FaYoutube className="w-6 h-6 lg:w-10 lg:h-10" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center gap-y-5 md:gap-y-10 flex-1/8 md:ml-4">
          <div className="font-light text-white flex flex-col gap-y-1 text-xs xl:text-lg">
            <a href="/about" className="text-white hover:text-gray-300">Tentang Kami</a>
            <a href="/contact" className="text-white hover:text-gray-300">Hubungi Kami</a>
            <a href="/faq" className="text-white hover:text-gray-300">FAQ</a>
            <a href="/privacy-policy" className="text-white hover:text-gray-300">Kebijakan Privasi</a>
          </div>
          <div className="font-light text-white flex gap-y-1 text-xs xl:text-lg">
            <a href="/" className="text-white hover:text-gray-300 flex items-center"><MdKeyboardDoubleArrowUp /> Kembali ke Atas</a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center gap-y-5 md:gap-y-10 flex-[50%] xl:flex-1/4  ">
          <div className="flex flex-col items-start justify-center gap-y-1">
            <p className="text-white font-[400] text-xs lg:text-sm xl:text-base">Partner Ekspedisi</p>
            <img src={GroupExpedition} alt="Group Expedition" className="h-full" />
          </div>
          
          <div className="flex flex-col items-start justify-center gap-y-1">
            <p className="text-white font-[400] text-xs lg:text-sm xl:text-base">Payment Gateway</p>
            <img src={GroupPay} alt="Group Payment" className="h-full" />
          </div>
        </div>
      </div>
    </footer>
  )
}