import Hero from '../components/Home/Hero.jsx'
import Progress from '../components/Home/MemberProgress.jsx'
import Services from '../components/Home/Services.jsx'
import HomeCatalog from '../components/Home/HomeCatalog.jsx'
import BuyAgain from '../components/Home/BuyAgain.jsx'
import Testimony from '../components/Home/Testimony.jsx'
import BlogHome from '../components/Home/BlogHome.jsx'

export default function Home() {
  return (
    <section className='flex flex-col gap-y-5'>
      <Hero />
      <Progress />
      <Services />
      <HomeCatalog />
      <BuyAgain />
      <Testimony />
      <BlogHome />
    </section>
  )
}