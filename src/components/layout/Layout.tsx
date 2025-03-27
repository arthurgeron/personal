import { ParentProps } from 'solid-js';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps extends ParentProps {
  className?: string;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class={`min-h-screen flex flex-col ${props.className || ''}`}>
      <Header />
      <main class="flex-grow">
        {props.children}
      </main>
      <Footer />
    </div>
  );
} 