import type { ParentProps } from 'solid-js';
import Footer from './Footer';
import Header from './Header';

export default function Layout(props: ParentProps<{ className?: string }>) {
  return (
    <div class={`min-h-screen flex flex-col ${props.className || ''}`}>
      <Header />
      <main class="flex-grow">{props.children}</main>
      <Footer />
    </div>
  );
}
