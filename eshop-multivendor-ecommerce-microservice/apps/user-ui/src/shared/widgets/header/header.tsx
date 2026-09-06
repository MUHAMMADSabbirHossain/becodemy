import Link from 'next/link';
import React from 'react';
import { Search } from 'lucide-react';
import ProfileIcon from '@/assets/svgs/profile-icon';
import HeartIcon from '@/assets/svgs/heart-icon';
import CartIcon from '@/assets/svgs/cart-icon';
import HeaderBottom from './header-bottom';

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href="/">
            <span className="text-2xl font-bold">Eshop</span>
          </Link>
        </div>

        <div className="relative w-[50%]">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search for products..."
            className="w-full px-4 font-poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-13.5"
          />
          <div className="w-15 cursor-pointer flex items-center justify-center h-13.5 bg-[#3489FF] absolute top-0 right-0">
            <Search color="#ffffff" />
          </div>
        </div>
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
      </div>

      <div className="border-b border-[#99999938]" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
