import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExpenseItem {
  name: string;
  category: string;
  amountEUR: number;
  status: string;
  city?: string;
  note?: string;
  date?: string;
  image?: string;
  showInCarousel?: boolean;
}

interface ExpensesParallaxProps {
  expensesData: {
    items: ExpenseItem[];
    categories?: { name: string; color: string }[];
  };
}

const Card = ({
  i,
  item,
  progress,
  range,
  targetScale,
  color,
}: {
  i: number;
  item: ExpenseItem;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  color: string;
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
       className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          backgroundColor: color,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] h-[500px] w-[90%] md:w-[1000px] rounded-[25px] p-12 origin-top shadow-2xl border border-white/10"
      >
        <div className="flex h-full gap-12 flex-col md:flex-row">
            {/* Left Content */}
          <div className="flex flex-col justify-between w-full md:w-[60%] z-10">
            <div>
                <div className="flex items-center gap-3 mb-4">
                     <span className="bg-black/20 text-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {item.category}
                     </span>
                      {item.city && (
                        <span className="text-black/60 text-sm font-medium flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {item.city}
                        </span>
                    )}
                </div>
                 {item.date && (
        <div className="text-black/50 text-sm font-medium mb-1">
          {new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">{item.name}</h2>
              {item.note && <p className="text-black/70 text-lg mt-4 max-w-md leading-relaxed">{item.note}</p>}
            </div>

            <div className="mt-8">
                 <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-black tracking-tight">{item.amountEUR}</span>
                    <span className="text-3xl font-medium text-black/70">€</span>
                 </div>
                 <div className="mt-2 text-black/50 font-medium">
                    State: <span className={item.status === 'CONFIRMED' ? 'text-green-800' : 'text-orange-800'}>{item.status}</span>
                 </div>
            </div>
          </div>

            {/* Right Visual / Image Placeholder */}
          <div className="relative w-full md:w-[40%] h-full rounded-[20px] overflow-hidden bg-white/20">
            <motion.div
              className="w-full h-full object-cover bg-linear-to-br from-white/40 to-white/10"
              style={{ scale: imageScale }}
            >
                {item.image ? (
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-9xl opacity-20 select-none">
                        {item.category === 'Vuelos' && '✈️'}
                        {item.category === 'Hoteles' && '🏨'}
                        {item.category === 'Transporte' && '🚆'}
                        {item.category === 'Seguro' && '🛡️'}
                        {item.category === 'Experiencias' && '🎫'}
                    </div>
                )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function ExpensesParallax({ expensesData }: ExpensesParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
        lenis.destroy();
    }
  }, []);

  if (!expensesData || !expensesData.items) return null;

  const items = [...(expensesData.items || [])]
    .filter(item => item.showInCarousel !== false) // Default to true
    .sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const categories = expensesData.categories || [];

  const getCategoryColor = (catName: string) => {
    const cat = categories.find((c: any) => c.name === catName);
    return cat ? cat.color : '#e2e8f0'; 
  };

  return (
    <div ref={container} className="relative mt-[10vh] mb-[20vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center mb-10 overflow-hidden pointer-events-none">
             <h2 className="text-[15vw] font-bold text-slate-800/10 dark:text-white/5 whitespace-nowrap">
                Eventos
             </h2>
        </div>

      {items.map((item, i) => {
        const targetScale = 1 - (items.length - i) * 0.05;
        return (
          <Card
            key={i}
            i={i}
            item={item}
            progress={scrollYProgress}
            range={[i * (1 / items.length), 1]}
            targetScale={targetScale}
            color={getCategoryColor(item.category)}
          />
        );
      })}
    </div>
  );
}
