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
        <svg 
          class="section-divider-wave" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <title>Section Divider Wave</title>
          <path 
            fill="rgb(229 231 235)" 
            fill-opacity="1" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,64C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
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
