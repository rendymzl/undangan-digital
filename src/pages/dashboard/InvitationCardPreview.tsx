import React from 'react';
import type { Theme } from '@/types/theme';

interface Props {
  theme: Theme;
  initials: string;
}

export const InvitationCardPreview: React.FC<Props> = ({ theme, initials }) => {
  const { colors, fontTitle, fontText, ornaments } = theme;
  const Ornament = ornaments?.coverTop;

  return (
    <div 
      className="aspect-[16/9] w-full rounded-t-lg p-2 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: colors.background }}
    >
      {/* Header Preview */}
      <div 
        className="w-full text-center py-2 rounded-t-md"
        style={{ background: colors.primary, color: colors.primaryForeground }}
      >
        <p className={`text-[8px] opacity-80 ${fontText}`}>The Wedding Of</p>
        <h3 className={`text-lg ${fontTitle}`}>{initials}</h3>
      </div>
      
      {/* Body Preview */}
      <div className="w-full flex-grow p-1 flex flex-col items-center justify-center">
        {Ornament && (
          <div className="scale-50 opacity-70">
            <Ornament theme={theme} />
          </div>
        )}
        <div className="w-full h-1 mt-1 rounded-full" style={{ background: colors.secondary }}></div>
        <div className="w-2/3 h-1 mt-1 rounded-full" style={{ background: colors.secondary }}></div>
      </div>
    </div>
  );
};