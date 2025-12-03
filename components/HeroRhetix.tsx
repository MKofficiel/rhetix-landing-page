"use client";

import { useState } from "react";

interface WaitlistResponse {
  success: boolean;
  alreadyRegistered?: boolean;
  error?: string;
  message?: string;
}

export default function HeroRhetix() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset des états
    setError("");
    setAlreadyRegistered(false);

    // Validation côté client
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      // Appel à l'API route
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: WaitlistResponse = await response.json();

      if (data.success) {
        // Succès : reset du champ et ouverture du modal
        setEmail("");
        setAlreadyRegistered(data.alreadyRegistered || false);
        setShowModal(true);
      } else {
        // Erreur retournée par l'API
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className='min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center px-6 py-12'>
        <div className='max-w-7xl w-full grid lg:grid-cols-[1.5fr,1fr] gap-12 lg:gap-16 items-center'>
          {/* Colonne gauche : Texte */}
          <div className='space-y-8'>
            {/* Headline */}
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              The AI App That Helps You{" "}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>
                Speak Smarter
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-xl md:text-2xl text-[#e4e4e7] leading-relaxed'>
              Speak and write with clarity. Rhetix helps you find the right
              words, express your ideas with confidence, and communicate in a
              more professional and impactful way.
            </p>

            {/* Paragraphe descriptif */}
            <p className='text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl'>
              Many people think quickly but have trouble expressing themselves
              the way they want. Rhetix makes communication easier by helping
              you choose stronger words, build a richer vocabulary, and share
              your thoughts with confidence.
            </p>

            {/* Social proof */}
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <svg
                className='w-5 h-5 text-green-500'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span>
                Built for creators, students, professionals, and anyone who
                wants to communicate better.
              </span>
            </div>
          </div>

          {/* Colonne droite : Card avec formulaire */}
          <div className='w-full'>
            <div className='bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-2xl'>
              {/* Icon / Image placeholder */}
              <div className='mb-6 flex justify-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className='text-2xl font-bold text-center mb-6'>
                Sign up now to join the early access
              </h2>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-300 mb-2'
                  >
                    Email address
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='your.email@example.com'
                    className='w-full px-4 py-3 bg-[#0b0b0c] border border-[#27272a] rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent transition-all'
                    disabled={isLoading}
                    required
                  />
                  {error && (
                    <p className='mt-2 text-sm text-red-400'>{error}</p>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 
                           text-white font-semibold rounded-lg hover:from-blue-600 
                           hover:to-purple-700 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#18181b] 
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? "Joining..." : "Join The Waitlist"}
                </button>
              </form>

              {/* Texte sous le bouton */}
              <p className='mt-4 text-center text-sm text-gray-500'>
                Launching soon. Be the first to try Rhetix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de confirmation */}
      {showModal && (
        <div
          className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50'
          onClick={() => setShowModal(false)}
        >
          <div
            className='bg-[#18181b] border border-[#27272a] rounded-2xl p-8 max-w-md w-full shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className='mb-6 flex justify-center'>
              <div className='w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className='text-2xl font-bold text-center mb-4'>
              {alreadyRegistered
                ? "You're already on the list! 🎉"
                : "Check your inbox 📩"}
            </h3>

            {/* Message */}
            <p className='text-gray-400 text-center mb-6 leading-relaxed'>
              {alreadyRegistered
                ? "Good news — you're already signed up for early access. We'll notify you as soon as Rhetix launches!"
                : "We've sent you an email. If you don't see it in a few minutes, check your spam folder. Thanks for joining the Rhetix early access."}
            </p>

            {/* Bouton Close */}
            <button
              onClick={() => setShowModal(false)}
              className='w-full py-3 px-6 bg-[#27272a] text-white font-semibold rounded-lg 
                       hover:bg-[#3f3f46] focus:outline-none focus:ring-2 focus:ring-gray-500 
                       transition-all'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
