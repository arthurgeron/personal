import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { For, createSignal, onMount } from 'solid-js';
import { Motion } from 'solid-motionone';
import { isDarkMode } from '../../utils/theme';
import { SKILLS } from '../../constants/skills';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  let containerRef: HTMLDivElement | undefined;
  const [hoveredSkill, setHoveredSkill] = createSignal<string | null>(null);

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
        <div 
          class="section-divider-gradient" 
          aria-hidden="true"
        />
      </div>
      <section ref={containerRef} class="section py-20">
        <div class="container-custom">
          <h2 class="section-title">Skills & Technologies</h2>

          <div class="flex flex-wrap justify-center gap-4 mt-12">
            <For each={SKILLS}>
              {(skill) => (
                <Motion.div
                  class="skill-item px-6 py-3 rounded-full bg-base-200 shadow-sm hover:shadow-md transition-all duration-300"
                  classList={{
                    'bg-primary text-white': hoveredSkill() === skill.name,
                    'text-neutral-content': isDarkMode() && hoveredSkill() !== skill.name,
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
