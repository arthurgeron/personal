import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMount } from 'solid-js';
import SplitType from 'split-type';

export default function About() {
  let titleRef: HTMLHeadingElement | undefined;
  let textRef: HTMLDivElement | undefined;
  let containerRef: HTMLElement | undefined;

  onMount(() => {
    if (!titleRef || !textRef || !containerRef) return;

    // Split the text into chars for animation
    const titleSplit = new SplitType(titleRef, { types: 'chars' });
    const textSplit = new SplitType(textRef, { types: 'lines' });

    gsap.fromTo(
      titleSplit.chars,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top bottom',
        },
      },
    );

    gsap.fromTo(
      textSplit.lines,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef,
          start: 'top bottom-=100px',
        },
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
      <section ref={containerRef} class="section bg-base-200 py-20">
        <div class="container-custom">
          <div class="max-w-4xl mx-auto">
            <h2 ref={titleRef} class="section-title mb-12">
              About Me
            </h2>

            <div ref={textRef} class="prose prose-lg max-w-none">
              <p class="mb-6">
                I'm a passionate Web3 & React Developer with expertise in building
                decentralized applications and modern web interfaces. As a
                contributor to the Fuel Network, I'm actively involved in
                developing the next generation of blockchain technologies.
              </p>

              <p class="mb-6">
                My journey in software development has led me to create tools and
                libraries that help developers build performant and scalable
                applications. I believe in writing clean, maintainable code that
                solves real problems.
              </p>

              <p>
                When I'm not coding, I'm exploring new technologies, contributing
                to open source projects, and sharing knowledge with the developer
                community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
