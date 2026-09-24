'use client';

import useSeller from '@/hooks/useSeller';
import useSidebar from '@/hooks/useSidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Box from '../box';
import * as Sidebar from './sidebar.style';
import Link from 'next/link';
import Logo from '@/assets/svgs/logo';
import SidebarItem from './sidebar.item';
import HomeIcon from '@/assets/icons/home';
import SidebarMenu from './sidebar.menu';
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from 'lucide-react';
import PaymentIcon from '@/assets/icons/payment';

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const seller = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? '#0085ff' : '#969696';

  return (
    <Box
      css={{
        width: '100%',
        height: '100%',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: 0,
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href="/" className="flex justify-center text-center gap-2">
            <Logo width={18} height={18} />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee">
                {seller?.shop?.name}
              </h3>

              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-42.5">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<HomeIcon color={getIconColor('/dashboard')} size={26} />}
            isActive={activeSidebar === '/dashboard'}
            href="/dashboard"
          />

          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={
                  <ListOrdered
                    size={26}
                    color={getIconColor('/dashboard/orders')}
                  />
                }
                isActive={activeSidebar === '/dashboard/orders'}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="Payments"
                icon={
                  <PaymentIcon
                    size={26}
                    color={getIconColor('/dashboard/payments')}
                  />
                }
                isActive={activeSidebar === '/dashboard/payments'}
                href="/dashboard/payments"
              />
            </SidebarMenu>

            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                icon={
                  <SquarePlus
                    size={26}
                    color={getIconColor('/dashboard/create-product')}
                  />
                }
                isActive={activeSidebar === '/dashboard/create-product'}
                href="/dashboard/create-product"
              />
              <SidebarItem
                title="All Products"
                icon={
                  <PackageSearch
                    size={26}
                    color={getIconColor('/dashboard/all-products')}
                  />
                }
                isActive={activeSidebar === '/dashboard/all-products'}
                href="/dashboard/all-products"
              />
            </SidebarMenu>

            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={26}
                    color={getIconColor('/dashboard/create-event')}
                  />
                }
                href="/dashboard/create-event"
                isActive={activeSidebar === '/dashboard/create-event'}
              />
              <SidebarItem
                title="All Events"
                icon={
                  <BellPlus
                    size={26}
                    color={getIconColor('/dashboard/all-events')}
                  />
                }
                href="/dashboard/all-events"
                isActive={activeSidebar === '/dashboard/all-events'}
              />
            </SidebarMenu>

            <SidebarMenu title="Controlers">
              <SidebarItem
                title="Inbox"
                icon={
                  <Mail size={26} color={getIconColor('/dashboard/inbox')} />
                }
                href="/dashboard/indox"
                isActive={activeSidebar === '/dashboard/indox'}
              />
              <SidebarItem
                title="Settings"
                icon={
                  <Settings
                    size={26}
                    color={getIconColor('/dashboard/settings')}
                  />
                }
                href="/dashboard/settings"
                isActive={activeSidebar === '/dashboard/settings'}
              />
              <SidebarItem
                title="Notifications"
                icon={
                  <BellRing
                    size={26}
                    color={getIconColor('/dashboard/notifications')}
                  />
                }
                href="/dashboard/notifications"
                isActive={activeSidebar === '/dashboard/notifications'}
              />
            </SidebarMenu>

            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                icon={
                  <TicketPercent
                    size={26}
                    color={getIconColor('/dashboard/discount-codes')}
                  />
                }
                href="/dashboard/discount-codes"
                isActive={activeSidebar === '/dashboard/discount-codes'}
              />

              <SidebarItem
                title="Logout"
                icon={
                  <LogOut size={26} color={getIconColor('/dashboard/logout')} />
                }
                href="/dashboard/logout"
                isActive={activeSidebar === '/dashboard/logout'}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
