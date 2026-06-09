import Orb from './components/background/orb';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <style>{`
        .home-main-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        
        /* CHOTE SCREEN KE LIYE PADDING (Mobile View) */
        @media (max-width: 768px) {
          .home-main-container {
            padding-left: 10px;
            padding-right: 10px;
          }
        }
      `}</style>

      {/* BACKGROUND LAYER */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, 
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <Orb hoverIntensity={0.2} rotateOnHover={true} />
      </div>

      {/* FOREGROUND CONTENT */}
      <main className="home-main-container">
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Hero />
        </div>
        
        <Features />
        <Testimonials />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}