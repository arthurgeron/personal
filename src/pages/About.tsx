import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMount } from 'solid-js';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  let containerRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!containerRef) return;

    const sections = containerRef.querySelectorAll('.animate-section');

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        },
      );
    });
  });

  return (
    <div ref={containerRef} class="pt-24 pb-16">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-12 text-gradient">
            About Me
          </h1>

          <section class="animate-section mb-16">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
              Background
            </h2>
            <div class="prose prose-lg max-w-none">
              <p>
                I'm Arthur Geron, a Web3 & React Developer with a passion for
                building modern, efficient, and user-friendly applications. As a
                Fuel Network Contributor, I'm dedicated to advancing blockchain
                technology and creating tools that help developers build better
                software.
              </p>
              <p>
                My technical journey began with web development, which quickly
                expanded into mobile application development with React Native.
                In recent years, I've focused on blockchain technologies and
                decentralized applications, contributing to various open-source
                projects along the way.
              </p>
            </div>
          </section>

          <section class="animate-section mb-16">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
              Philosophy
            </h2>
            <div class="prose prose-lg max-w-none">
              <p>
                I believe in writing clean, maintainable, and performant code.
                My work on projects like the ESLint Plugin for React useMemo
                demonstrates my commitment to helping developers create more
                efficient applications. I'm a strong advocate for best practices
                and continually strive to improve my craft.
              </p>
              <p>
                Open source contribution is an essential part of my professional
                philosophy. I enjoy collaborating with developers worldwide and
                sharing knowledge to push the boundaries of what's possible in
                software development.
              </p>
            </div>
          </section>

          <section class="animate-section mb-16">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
              Experience
            </h2>
            <div class="prose prose-lg max-w-none">
              <p>
                My professional experience spans across frontend development,
                mobile applications, and blockchain technologies. I've worked
                with companies of various sizes, from startups to established
                businesses, helping them implement modern technical solutions.
              </p>
              <p>
                As a contributor to the Fuel Network, I'm actively involved in
                developing the future of blockchain technology, focusing on
                scalability, security, and developer experience.
              </p>
            </div>
          </section>

          <section class="animate-section">
            <h2 class="text-2xl font-bold mb-6 border-l-4 border-primary pl-4">
              Beyond Coding
            </h2>
            <div class="prose prose-lg max-w-none">
              <p>
                When I'm not coding, I enjoy exploring new technologies, reading
                technical articles, and participating in developer communities.
                I believe in continuous learning and stay up-to-date with the
                latest trends in software development.
              </p>
              <p>
                I also enjoy sharing my knowledge through articles, tutorials,
                and open source contributions, helping other developers grow
                their skills and build better applications.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
