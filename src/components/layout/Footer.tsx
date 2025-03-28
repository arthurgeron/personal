import { A } from '@solidjs/router';
import SocialLinks from '../shared/SocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-neutral text-neutral-content">
      <div class="container-custom py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-xl font-bold mb-4">Arthur Geron</h3>
            <p class="mb-4">
              Web3 & React Developer specializing in building modern, performant
              web applications.
            </p>
            <SocialLinks />
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Quick Links</h3>
            <nav class="flex flex-col space-y-2">
              <A href="/" class="hover:text-primary transition-colors">
                Home
              </A>
              <A href="/about" class="hover:text-primary transition-colors">
                About
              </A>
              <A href="/projects" class="hover:text-primary transition-colors">
                Projects
              </A>
              <A href="/contact" class="hover:text-primary transition-colors">
                Contact
              </A>
            </nav>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Technologies</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-primary/20 rounded-full text-sm">
                React
              </span>
              <span class="px-3 py-1 bg-primary/20 rounded-full text-sm">
                React Native
              </span>
              <span class="px-3 py-1 bg-primary/20 rounded-full text-sm">
                TypeScript
              </span>
              <span class="px-3 py-1 bg-primary/20 rounded-full text-sm">
                Web3
              </span>
              <span class="px-3 py-1 bg-primary/20 rounded-full text-sm">
                Fuel Network
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-neutral-content/20 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p>© {currentYear} Arthur Geron. All rights reserved.</p>
          <p class="text-sm mt-2 sm:mt-0">Built with SolidJS + Rspack + Bun</p>
        </div>
      </div>
    </footer>
  );
}
