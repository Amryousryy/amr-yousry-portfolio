import { Canvas } from '@react-three/fiber';
import { Stars, Preload, AdaptiveEvents, ScrollControls, Scroll } from '@react-three/drei';
import { Suspense } from 'react';
import FilmStudioIsland from './FilmStudioIsland';
import HeroText from '../ui/HeroText';
import FilmStripSection from '../sections/FilmStripSection';
import ServicesSection from '../sections/ServicesSection';
import AboutSection from '../sections/AboutSection';
import ContactSection from '../sections/ContactSection';

const SceneCanvas = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#050508]">
      {/* CSS Overlay for Film Grain */}
      <div className="film-grain" />
      <div className="scanlines" />
      
      <Canvas
        shadows
        camera={{ near: 0.1, far: 1000, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#050508']} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight
            position={[-10, 15, 10]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
          />

          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          
          <ScrollControls pages={6} damping={0.2}>
            <FilmStudioIsland />
            
            <Scroll html>
              <div className="w-screen">
                <section className="h-screen relative overflow-hidden">
                  <HeroText />
                </section>
                
                <FilmStripSection />
                <ServicesSection />
                <AboutSection />
                <ContactSection />
                
                <footer className="py-12 border-t border-zinc-900 text-center">
                  <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                    © 2026 AMR YOUSRY // ALL RIGHTS RESERVED // PIXEL CINEMA ENGINE v1.0
                  </div>
                </footer>
              </div>
            </Scroll>
          </ScrollControls>
          
          <Preload all />
          <AdaptiveEvents />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
