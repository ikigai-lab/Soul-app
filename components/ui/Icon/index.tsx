import React from 'react';
import { icons, LucideIcon } from 'lucide-react-native';

interface IconProps {
  name: string; // Changed from keyof typeof icons
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  color = '#000000', 
  size = 24,
  strokeWidth = 2 
}) => {
  const LucideIconComponent = icons[name as keyof typeof icons] as LucideIcon;

  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return (
    <LucideIconComponent 
      color={color} 
      size={size} 
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;
