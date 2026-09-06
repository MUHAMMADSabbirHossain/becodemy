'use client';

import CartIcon from '@/assets/svgs/cart-icon';
import HeartIcon from '@/assets/svgs/heart-icon';
import ProfileIcon from '@/assets/svgs/profile-icon';
import { navItems } from '@/configs/constants';
import { NavItemTypes } from '@/configs/global';
import { AlignLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { JSX, useEffect, useState } from 'react';

const HeaderBottom = (): JSX.Element => {
  const [show, setShow] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setIsSticky(true);
      else setIsSticky(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300  ${isSticky ? 'fixed top-0 left-0 z-100 bg-white shadow-lg' : 'relative'}         `}
    >
      <div
        className={`w-[80%] relative flex items-center justify-between m-auto ${isSticky ? 'pt-3' : 'py-0'}`}
      >
        {/* All Dropdowns */}
        <div
          className={`w-65 ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-center px-5 h-12.5 bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="#ffffff" />
            <span className="text-white font-medium">All Departments</span>
          </div>

          <ChevronDown color="white" />

          {/* Dropdown menu */}
          {show && (
            <div
              className={`absolute left-0 ${isSticky ? 'top-17.5' : 'top-12.5'} w-65 h-100 bg-[#f5f5f5]`}
            ></div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center">
          {navItems.map((i: NavItemTypes, index: number) => (
            <Link
              className="px-5 font-medium text-lg"
              href={i.href}
              key={index}
            >
              {i.title}
            </Link>
          ))}
        </div>

        <div>
          {isSticky && (
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Link
                  href={'/login'}
                  className="border-2 w-12.5 h-12.5 flex items-center justify-center rounded-full border-[#010f1c1a]"
                >
                  <ProfileIcon />
                </Link>
                <Link href={'/login'}>
                  <span className="block font-medium">Hello,</span>{' '}
                  <span className="font-semibold">Sign In</span>
                </Link>
              </div>

              <div className="flex items-center gap-5">
                <Link href={'/wishlist'} className="relative">
                  <HeartIcon color="#010f1c" />
                  <div className="w-6 h-6 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-2.5 -right-2.5">
                    <span className="text-white font-medium text-sm">3</span>
                  </div>
                </Link>

                <Link href={'/wishlist'} className="relative">
                  <CartIcon color="#010f1c" />
                  <div className="w-6 h-6 border-white bg-red-500 rounded-full flex items-center justify-center absolute -top-2.5 -right-2.5">
                    <span className="text-white font-medium text-sm">0</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
