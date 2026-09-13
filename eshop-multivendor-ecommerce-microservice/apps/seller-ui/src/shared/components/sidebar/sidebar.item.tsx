import Link from 'next/link';
import React, { JSX } from 'react';

interface Props {
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
  href: string;
}

const SidebarItem = ({ icon, title, isActive, href }: Props): JSX.Element => {
  return (
    <div>
      <Link href={href} className="my-2 block">
        <div
          className={`flex gap-2 w-full min-h-12 h-full items-center px-3.25 rounded-lg cursor-pointer transition hover:bg-[#2b2f31] ${isActive && 'scale-[.98] bg-[#0f3158] fill-blue-200 hover:bg-[#of3158d6]'} `}
        >
          {icon}
          <h5 className="text-slate-200 text-lg">{title}</h5>
        </div>
      </Link>
    </div>
  );
};

export default SidebarItem;
