import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const Landing = () => {
  // Refs for various elements to animate
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const featuresRef = useRef(null);
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // Initial animation setup
    gsap.set([logoRef.current, taglineRef.current, headingRef.current, featuresRef.current], { 
      opacity: 0,
      y: 50
    });
    
    gsap.set([loginRef.current, signupRef.current], {
      opacity: 0,
      x: 20
    });
    
    gsap.set(footerRef.current, {
      opacity: 0,
      y: 20
    });

    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Background image animation
    tl.to(".bg-image", { 
      duration: 2, 
      opacity: 0.5, 
      scale: 1.05,
      ease: "power2.inOut"
    }, 0);
    
    // Login and Signup button animations
    tl.to([loginRef.current, signupRef.current], {
      duration: 0.8,
      opacity: 1,
      x: 0,
      stagger: 0.2
    }, 0.3);
    
    // Logo animation
    tl.to(logoRef.current, { 
      duration: 1.2, 
      opacity: 1, 
      y: 0 
    }, 0.5);
    
    // Tagline animation
    tl.to(taglineRef.current, { 
      duration: 1, 
      opacity: 1, 
      y: 0 
    }, 0.8);
    
    // Heading animation
    tl.to(headingRef.current, { 
      duration: 1.5, 
      opacity: 1, 
      y: 0 
    }, 1.2);
    
    // Features section animation
    tl.to(featuresRef.current, { 
      duration: 1, 
      opacity: 1, 
      y: 0 
    }, 1.5);
    
    // Individual feature items animation
    tl.from(".feature-item", {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8
    }, 1.7);
    
    // Footer animation
    tl.to(footerRef.current, { 
      duration: 0.8, 
      opacity: 1, 
      y: 0 
    }, 2.2);
    
  }, []);

  return (
    <div className='flex flex-col bg-black min-h-screen text-white'>
      {/* Background image */}
      <div className='absolute inset-0 flex justify-center items-center'>
        <img src="/bg-ell.png" className='bg-image h-200 blur-3xl opacity-0 w-300' alt="background" />
      </div>
      <div className='bg-white/12 h-full pb-12 backdrop-blur-lg'>

        {/* Login and Signup buttons */}
        <div className='relative flex justify-end p-5'>
          <div className='font-bold text-2xl flex gap-5'>
            <span ref={loginRef} className='cursor-pointer hover:scale-105'>Login</span>
            <span ref={signupRef} className='cursor-pointer hover:scale-105'>Signup</span>
          </div>
        </div>

        {/* Logo and tagline */}
        <div className='relative flex flex-col items-center justify-between flex-grow px-4 py-16'>
          <div className='text-center mt-8'>
            <img ref={logoRef} src="/logo1.png" alt="Open In" className='mx-auto h-40 w-[120px] mb-5 mt-[15%] max-w-md' />
            <h2 ref={taglineRef} className='text-gray-400 font-medium text-xl'>Level Up Your Skills Like a Solo Protagonist</h2>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className='relative flex flex-col items-center justify-between flex-grow px-4 py-16'>
        <h1 ref={headingRef} className='text-2xl md:text-3xl lg:text-4xl text-center max-w-3xl mx-auto mt-32 mb-20'>
          AI-powered learning paths, daily challenges, and real progress toward your goals
        </h1>
      </div>

      {/* Features section */}
      <div ref={featuresRef} className='bg-purple-900/40 backdrop-blur-md rounded-lg p-8 max-w-xl w-full'>
        <ul className='flex flex-col gap-5 text-center'>
          <li className='feature-item py-2'>Personalized Learning Plan</li>
          <li className='feature-item py-2'>Rank System (E to S)</li>
          <li className='feature-item py-2'>Daily LeetCode & Project Tasks</li>
          <li className='feature-item py-2'>AI Feedback & GitHub Verification</li>
          <li className='feature-item py-2'>Real-Time Progress Tracking</li>
        </ul>
      </div>

      {/* Footer */}
      <div ref={footerRef} className='relative bg-gray-200/20 p-6 mt-auto'>
        <div className='flex justify-center gap-6'>
          {/* Social media links */}
          <a href="#" className='text-gray-400 hover:text-white'>
            <span className='sr-only'>Instagram</span>
            <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
            </svg>
          </a>
          <a href="#" className='text-gray-400 hover:text-white'>
            <span className='sr-only'>LinkedIn</span>
            <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/>
            </svg>
          </a>
          <a href="#" className='text-gray-400 hover:text-white'>
            <span className='sr-only'>GitHub</span>
            <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Landing