'use client';

import { activeSidebarItem } from '@/configs/constants';
import { useAtom } from 'jotai';

const useSidebar = () => {
  const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItem);

  return { activeSidebar, setActiveSidebar };
};

export default useSidebar;
