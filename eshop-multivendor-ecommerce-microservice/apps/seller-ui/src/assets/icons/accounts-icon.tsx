import { LucideProps, User } from 'lucide-react';
import React from 'react';

const AccountsIcon = ({ ...props }: LucideProps) => {
  return <User {...props} />;
};

export default AccountsIcon;
