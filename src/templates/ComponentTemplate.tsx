import React from 'react';

// Template for creating new components
// Copy this file and rename it to your component name

interface ComponentTemplateProps {
  // Define your props here
  className?: string;
  children?: React.ReactNode;
}

/**
 * Component description
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * Usage:
 * <ComponentTemplate className="custom-class">
 *   Content here
 * </ComponentTemplate>
 */
export default function ComponentTemplate({
  className = '',
  children,
}: ComponentTemplateProps) {
  return (
    <div className={`component-template ${className}`}>
      {children}
    </div>
  );
}

// Export types if needed
export type { ComponentTemplateProps };