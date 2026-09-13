import { Home, LucideProps } from 'lucide-react';
import React, { JSX } from 'react';

const HomeIcon = ({ ...props }: LucideProps): JSX.Element => {
  return <Home size={20} {...props} />;
};

export default HomeIcon;
