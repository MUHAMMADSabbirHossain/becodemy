import { HandCoins, LucideProps } from 'lucide-react';
import React from 'react';

const PaymentIcon = ({ ...props }: LucideProps) => {
  return <HandCoins size={20} {...props} />;
};

export default PaymentIcon;
