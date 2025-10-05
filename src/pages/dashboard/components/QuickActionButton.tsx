import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideProps } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: React.ComponentType<LucideProps>;
  href: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  variant?: 'default' | 'outline';
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  green: {
    bg: 'bg-green-50 hover:bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200',
    button: 'bg-green-600 hover:bg-green-700 text-white',
  },
  purple: {
    bg: 'bg-purple-50 hover:bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  orange: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    icon: 'text-orange-600',
    border: 'border-orange-200',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  red: {
    bg: 'bg-red-50 hover:bg-red-100',
    icon: 'text-red-600',
    border: 'border-red-200',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
};

export default function QuickActionButton({
  title,
  description,
  icon: Icon,
  href,
  color = 'blue',
  variant = 'default',
  className,
}: QuickActionButtonProps) {
  const colorClasses = colorVariants[color];

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer group',
        colorClasses.bg,
        colorClasses.border,
        'border',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
              'bg-white/80 group-hover:bg-white',
              'transition-colors duration-200'
            )}
          >
            <Icon className={cn('h-5 w-5', colorClasses.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
            <Button
              asChild
              size="sm"
              variant={variant}
              className={cn(
                'h-8 px-3 text-xs font-medium',
                variant === 'default' && colorClasses.button,
                variant === 'outline' && `border-current ${colorClasses.icon} hover:bg-white/50`
              )}
            >
              <Link to={href}>
                Mulai
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}