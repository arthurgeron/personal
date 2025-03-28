import { createSignal } from 'solid-js';
import SocialLinks from '../components/shared/SocialLinks';

export default function Contact() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [submitted, setSubmitted] = createSignal(false);
  const [error, setError] = createSignal(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!name() || !email() || !message()) {
      setError('Please fill out all fields');
      return;
    }

    if (!isValidEmail(email())) {
      setError('Please enter a valid email address');
      return;
    }

    // In a real application, you would send the form data to a server here
    // For now, we'll just simulate a successful submission
    setError(null);
    setSubmitted(true);

    // Reset form after submission
    setName('');
    setEmail('');
    setMessage('');

    // Reset submission status after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div class="pt-24 pb-16">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center text-gradient">
            Get In Touch
          </h1>
          <p class="text-lg text-center max-w-3xl mx-auto mb-12">
            I'm always open to discussing new projects, opportunities, or
            collaborations. Feel free to reach out with any questions or just to
            say hello!
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 class="text-2xl font-bold mb-6">Contact Information</h2>

              <div class="mb-8">
                <h3 class="font-bold mb-3">Email</h3>
                <a
                  href="mailto:contact@arthurgeron.com"
                  class="text-primary hover:text-primary/80 transition-colors"
                >
                  contact@arthurgeron.com
                </a>
              </div>

              <div class="mb-8">
                <h3 class="font-bold mb-3">Social Media</h3>
                <p class="mb-4">
                  You can also connect with me on social media:
                </p>
                <SocialLinks />
              </div>

              <div>
                <h3 class="font-bold mb-3">Location</h3>
                <p>Fuel Labs, Remote</p>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-6">Send Me a Message</h2>

              {submitted() ? (
                <div class="bg-success/20 text-success p-4 rounded-lg mb-6">
                  Thank you for your message! I'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} class="space-y-4">
                  {error() && (
                    <div class="bg-error/20 text-error p-4 rounded-lg">
                      {error()}
                    </div>
                  )}

                  <div>
                    <label for="name" class="block mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name()}
                      onInput={(e) => setName(e.currentTarget.value)}
                      class="w-full p-3 border border-neutral/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label for="email" class="block mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email()}
                      onInput={(e) => setEmail(e.currentTarget.value)}
                      class="w-full p-3 border border-neutral/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div>
                    <label for="message" class="block mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message()}
                      onInput={(e) => setMessage(e.currentTarget.value)}
                      class="w-full p-3 border border-neutral/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32"
                      placeholder="Your message"
                      required
                    />
                  </div>

                  <button type="submit" class="btn btn-primary w-full py-3">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
