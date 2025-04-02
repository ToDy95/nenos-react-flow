import React from 'react';

type ButtonProps = {
  text?: string;
  onClick: () => void;
  variant?:
    | 'default'
    | 'addNodeBetween'
    | 'addGroup'
    | 'addGroupBetween'
    | 'close';
  icon?: React.ReactNode;
};

export const Button = ({
  text,
  onClick,
  variant = 'default',
  icon,
}: ButtonProps) => {
  const baseStyle =
    'p-2 text-white rounded cursor-pointer transition-transform transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center';

  const variantStyles: Record<typeof variant, string> = {
    default: 'bg-blue-500 hover:bg-blue-600',
    addNodeBetween: 'bg-yellow-500 hover:bg-yellow-600',
    addGroup: 'bg-green-500 hover:bg-green-600',
    addGroupBetween: 'bg-purple-500 hover:bg-purple-600',
    close:
      'bg-red-500 hover:bg-red-600 text-xs px-1 py-0.5 absolute top-1 right-1 ',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]}`}
      onClick={onClick}>
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};
