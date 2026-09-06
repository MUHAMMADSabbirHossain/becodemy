import GoogleIcon from '@/assets/svgs/google-icon';
import { JSX } from 'react';

const GoogleButton = (): JSX.Element => {
  return (
    <div className="w-full flex justify-center">
      <div className="h-11.5 cursor-pointer border border-blue-100 flex items-center gap-2 px-3 rounded my-2 bg-[rgba(210, 227, 252, 0.3)]">
        <GoogleIcon width={30} height={30} />
        <span className="text-[16px] opacity-[.8] font-poppins">
          Sign in with Google
        </span>
      </div>
    </div>
  );
};

export default GoogleButton;
