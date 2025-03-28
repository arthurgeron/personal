import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { For, createSignal, onMount } from 'solid-js';
import { Motion } from 'solid-motionone';

gsap.registerPlugin(ScrollTrigger);

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
        start: 'top bottom',
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
      },
    );
  });

  return (
    <>
      <div class="section-divider">
        <svg 
          class="section-divider-wave flipped" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <title>Section Divider Wave</title>
          <path 
            fill="white" 
            fill-opacity="1" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,64C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      <section ref={containerRef} class="section py-20">
        <div class="container-custom">
          <h2 class="section-title">Skills & Technologies</h2>

          <div class="flex flex-wrap justify-center gap-4 mt-12">
            <For each={skills}>
              {(skill) => (
                <Motion.div
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
                </Motion.div>
              )}
            </For>
          </div>
        </div>
      </section>
    </>
  );
}
