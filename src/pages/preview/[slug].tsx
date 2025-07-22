import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UndanganDetailPage from '../UndanganDetailPage';
import CoverSection from '../undangan-sections/CoverSection';
import { themes } from '../../types/theme';

const PreviewUndangan = () => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Ambil data dari sessionStorage
    const data = sessionStorage.getItem('previewData');
    if (data) {
      setPreviewData(JSON.parse(data));
    }
  }, []);

  // Jika tidak ada data preview
  if (!previewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Data preview tidak tersedia
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Silakan kembali ke halaman pembuatan undangan dan klik tombol preview
        </p>
      </div>
    );
  }

  // Ambil theme dari previewData
  const theme = themes.find(t => t.id === previewData.tema) || themes[0];

  return (
    <div className="relative">
      {/* Info Preview */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="px-4 py-2 bg-black/80 backdrop-blur text-white rounded-full text-sm">
          Mode Preview
        </div>
      </div>
      {/* CoverSection dan flow buka undangan */}
      {isLocked ? (
        <CoverSection
          theme={theme}
          data={{
            namaPria: previewData.nama_pria,
            namaWanita: previewData.nama_wanita,
            namaPanggilanPria: previewData.nama_panggilan_pria,
            namaPanggilanWanita: previewData.nama_panggilan_wanita,
          }}
          namaTamu={"Preview"}
          onOpen={() => setIsLocked(false)}
          isLocked={isLocked}
          isFullScreen={true}
        />
      ) : (
        <UndanganDetailPage previewData={previewData} />
      )}
    </div>
  );
};

export default PreviewUndangan; 