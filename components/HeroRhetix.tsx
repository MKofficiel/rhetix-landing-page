"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Mail, X, Sparkles, Send } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Validation Schema (Zod) ---
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface WaitlistResponse {
  success: boolean;
  alreadyRegistered?: boolean;
  error?: string;
  message?: string;
}

export default function HeroRhetix() {
  const [showModal, setShowModal] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [serverError, setServerError] = useState("");

  // Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setServerError("");
    setAlreadyRegistered(false);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data: WaitlistResponse = await response.json();

      if (data.success) {
        setAlreadyRegistered(data.alreadyRegistered || false);
        setShowModal(true);
        reset();
      } else {
        setServerError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setServerError("Network error. Please try again later.");
    }
  };

  return (
    <section className='relative min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12 overflow-hidden'>
      {/* Background Gradients & Grid */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]'></div>
      <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]'></div>
      <div className='absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-10 blur-[100px]'></div>

      <div className='relative max-w-7xl w-full grid lg:grid-cols-[1.4fr,1fr] gap-12 lg:gap-20 items-center z-10'>
        {/* Colonne Gauche : Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='space-y-8 text-center'
        >
          <div className='inline-flex items-center mx-auto gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium'>
            <Sparkles className='w-4 h-4' />
            <span>AI-Powered Communication</span>
          </div>

          <h1 className='text-5xl text-center  md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight'>
            <span className='block'> The AI App That Helps You</span>{" "}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 animate-gradient-x'>
              Speak Smarter
            </span>
          </h1>

          <p className='text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto'>
            Rhetix helps you find the right words, express ideas with
            confidence, and communicate in a professional, impactful way.
          </p>

          {/* <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-zinc-500'>
            <div className='flex -space-x-2'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-xs font-medium text-white'
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p>Joined by 2,000+ creators and professionals.</p>
          </div> */}
        </motion.div>

        {/* Colonne Droite : Formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full'
        >
          <div className='bg-zinc-900/50 backdrop-blur-xl border mx-auto max-w-[600px] border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group'>
            {/* Glow effect on hover */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />

            <div className='relative z-10 '>
              <div className='mb-8'>
                <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20'>
                  <Send className='w-7 h-7 text-white' />
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                  Join the waitlist
                </h2>
                <p className='text-zinc-400'>
                  Get early access before we launch publicly.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2 '>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-zinc-300 ml-1'
                  >
                    Email address
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3.5 h-5 w-5 text-zinc-500' />
                    <input
                      {...register("email")}
                      type='email'
                      placeholder='alex@example.com'
                      className={cn(
                        "w-full pl-10 pr-4 py-3 bg-zinc-950/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
                        errors.email
                          ? "border-red-500/50 focus:ring-red-500/50"
                          : "border-zinc-800 focus:border-blue-500"
                      )}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className='text-xs text-red-400 ml-1'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <div className='p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm'>
                    {serverError}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Join the Waitlist"
                  )}
                </button>
              </form>

              <p className='mt-6 text-center text-xs text-zinc-600'>
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal - AnimatePresence pour animations de sortie */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50'
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden'
            >
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500' />

              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6'>
                  <CheckCircle2 className='w-8 h-8 text-green-500' />
                </div>

                <h3 className='text-2xl font-bold text-white mb-2'>
                  {alreadyRegistered
                    ? "Welcome back! 🎉"
                    : "You're on the list! 🚀"}
                </h3>

                <p className='text-zinc-400 mb-8 leading-relaxed'>
                  {alreadyRegistered
                    ? "You are already registered. We will notify you as soon as Rhetix is ready."
                    : "Thanks for joining. We've sent a confirmation email to your inbox. Stay tuned!"}
                </p>

                <button
                  onClick={() => setShowModal(false)}
                  className='w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  Close
                </button>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className='absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
