// import React from 'react';
// import type { Invitation, RSVP } from '@/types';
// import type { Theme } from '@/types/theme';
// import { formatOrangTua } from '@/utils/formatOrangTua'; // Pastikan path ini benar

// // Import semua komponen section yang Anda miliki

// import { Separator } from '@/components/ui/separator';
// import SalamSection from '../undangan-sections/SalamSection';
// import ProfileSection from '../undangan-sections/ProfileSection';
// import AcaraSection from '../undangan-sections/AcaraSection';
// import CeritaSection from '../undangan-sections/CeritaSection';
// import GaleriSection from '../undangan-sections/GaleriSection';
// import UcapanDanRSVPSection from '../undangan-sections/UcapanDanRSVPSection';
// import AmplopSection from '../undangan-sections/AmplopSection';
// import PenutupSection from '../undangan-sections/PenutupSection';

// // Props yang diterima oleh komponen layout
// interface LayoutProps {
//   invitation: Invitation;
//   theme: Theme;
//   ucapanList: RSVP[];
//   handleUcapanSubmit: (form: { guestName: string; message: string; attendanceStatus: 'attending' | 'not_attending' | 'pending' }) => Promise<void>;
//   page: number;
//   pageSize: number;
//   totalCount: number;
//   onPageChange: (newPage: number) => void;
// }

// const ModernLayout: React.FC<LayoutProps> = (props) => {
//   const { invitation, theme } = props;
//   const {
//     mempelaiPria,
//     mempelaiWanita,
//     akad,
//     resepsi,
//     urutanMempelai,
//     ceritaCinta,
//     galeri,
//     galeriAktif,
//     amplopDigital,
//   } = invitation;

//   return (
//     <>
//       <SalamSection theme={theme} />
      
//       {/* --- BAGIAN UTAMA LAYOUT MODERN --- */}
//       <div className="py-16 px-4">
//         {/* Gunakan grid untuk membagi layout menjadi dua kolom di layar desktop */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          
//           {/* --- KOLOM KIRI: PROFIL MEMPELAI --- */}
//           <div className="flex flex-col items-center">
//             <ProfileSection
//               theme={theme}
//               data={{
//                 mempelai1: urutanMempelai === 'pria-wanita' ? mempelaiPria : mempelaiWanita,
//                 mempelai2: urutanMempelai === 'pria-wanita' ? mempelaiWanita : mempelaiPria,
//               }}
//               formatOrangTua={formatOrangTua}
//               mempelai1IsPria={urutanMempelai === 'pria-wanita'}
//             />
//           </div>

//           {/* --- KOLOM KANAN: DETAIL ACARA --- */}
//           <div className="flex flex-col gap-y-8 mt-8 md:mt-0">
//             {invitation.adaAkad && <AcaraSection title="Akad Nikah" theme={theme} data={akad} />}
//             {invitation.adaResepsi && <AcaraSection title="Resepsi" theme={theme} data={resepsi} />}
//           </div>
//         </div>
//       </div>
      
//       <Separator className="my-8" />
      
//       {/* --- Sisa section ditampilkan secara berurutan di bawah --- */}
//       {ceritaCinta && <CeritaSection theme={theme} data={{ cerita: ceritaCinta }} />}
      
//       {galeriAktif && galeri && galeri.length > 0 && (
//         <GaleriSection theme={theme} images={galeri.map(foto => foto.url)} />
//       )}

//       <UcapanDanRSVPSection {...props} />

//       {amplopDigital && amplopDigital.length > 0 && (
//         <AmplopSection
//           theme={theme}
//           data={{
//             namaPria: mempelaiPria.nama,
//             namaWanita: mempelaiWanita.nama,
//             rekening: amplopDigital,
//           }}
//         />
//       )}
      
//       <PenutupSection
//         theme={theme}
//         data={{
//           namaPria: mempelaiPria.namaPanggilan || mempelaiPria.nama.split(' ')[0],
//           namaWanita: mempelaiWanita.namaPanggilan || mempelaiWanita.nama.split(' ')[0],
//         }}
//       />
//     </>
//   );
// };

// export default ModernLayout;