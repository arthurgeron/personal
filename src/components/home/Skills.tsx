import { createSignal, onMount } from 'solid-js';
import { gsap } from 'gsap';
import { motion } from '@motionone/solid';

export default function Skills() {
  let containerRef: HTMLDivElement | undefined;
  const [hoveredSkill, setHoveredSkill] = createSignal<string | null>(null);
  
  const skills = [
    { name: 'React', category: 'frontend' },
    { name: 'React Native', category: 'frontend' },
    { name: 'TypeScript', category: 'languages' },
    { name: 'JavaScript', category: 'languages' },
    { name: 'HTML/CSS', category: 'frontend' },
    { name: 'Web3', category: 'web3' },
    { name: 'Fuel Network', category: 'web3' },
    { name: 'Solidity', category: 'web3' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Redux', category: 'frontend' },
    { name: 'ESLint', category: 'tools' },
    { name: 'Git', category: 'tools' },
  ];
  
  onMount(() => {
    if (!containerRef) return;
    
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef,
        start: 'top 70%',
      },
    });
    
    timeline.fromTo(
      '.skill-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  });
  
  return (
    <section ref={containerRef} class="section py-20">
      <div class="container-custom">
        <h2 class="section-title">Skills & Technologies</h2>
        
        <div class="flex flex-wrap justify-center gap-4 mt-12">
          {skills.map((skill) => (
            <motion.div
              class="skill-item px-6 py-3 rounded-full bg-base-200 shadow-sm hover:shadow-md transition-all duration-300"
              classList={{
                'bg-primary text-white': hoveredSkill() === skill.name,
              }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              animate={{
                scale: hoveredSkill() === skill.name ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {skill.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 