import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { For, onMount } from 'solid-js';
import { A } from '@solidjs/router';
import { isDarkMode } from '../../utils/theme';
import { SKILLS } from '../../constants/skills';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  let containerRef: HTMLDivElement | undefined;

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
                <A
                  href={`/projects?skill=${encodeURIComponent(skill.name)}`}
                  class="skill-item px-6 py-3 rounded-full bg-base-200 shadow-sm hover:shadow-md hover:bg-primary hover:text-white transition-all duration-300"
                  classList={{
                    'text-neutral-content': isDarkMode(),
                  }}
                >
                  {skill.name}
                </A>
              )}
            </For>
          </div>
        </div>
      </section>
    </>
  );
}
