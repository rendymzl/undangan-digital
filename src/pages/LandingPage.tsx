import React from 'react';
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Heart, Send, Pen } from "lucide-react";
import { themes } from '@/types/theme';
import { TemplateGrid } from '@/components/shared/TemplateGrid';
import heroImage from '../assets/hero-undangan.png';
import { Label } from '@/components/ui/label';

// --- Komponen Fitur Reusable ---
const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
  <div className="group text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg rounded-xl p-4 bg-white/80 flex flex-col items-center">
    <div className="flex justify-center items-center mb-3 w-full">
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center shadow-md group-hover:bg-primary/20 transition-all duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-2 text-primary group-hover:text-primary/90 transition-colors duration-300">{title}</h3>
    <p className="text-base text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

// Komponen PricingTier yang lebih rapi
const PricingTier: React.FC<{
  tier: string;
  price: React.ReactNode;
  description: string;
  features: string[];
  isPopular?: boolean;
}> = ({ tier, price, description, features, isPopular = false }) => (
  <div className={`relative border w-full rounded-2xl p-8 flex flex-col bg-white ${isPopular ? 'border-primary shadow-xl z-10' : 'border-gray-200 shadow-sm'} transition-all duration-300`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 text-xs font-semibold tracking-wide text-primary-foreground bg-primary rounded-full shadow">
        Paling Populer
      </div>
    )}
    <h3 className="text-xl font-bold text-primary mb-2">{tier}</h3>
    <div className="flex items-center gap-2 mb-2">
      {price}
      <span className="text-xs text-muted-foreground">/undangan</span>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
    {/* Separator */}
    <div className="border-t border-gray-200 my-6"></div>
    <ul className="space-y-3 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>
    {/* Separator */}
    <div className="border-t border-gray-200 my-6"></div>
    <Button className={`w-full text-base font-semibold py-2 ${isPopular ? '' : 'bg-primary/80'}`}>
      Buat Undangan
    </Button>
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- 1. Header/Navigation --- */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Menantikan</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Daftar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* --- 2. Hero Section dengan Gambar --- */}
        <section className="min-h-screen flex items-center justify-center text-center bg-gray-50 pt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
              {/* Kiri: Teks dan CTA */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Bikin Website Undangan Pernikahan dalam Hitungan Menit!
                </h2>
                <div className="mb-8 flex gap-8 text-lg text-muted-foreground text-right">
                  <div className="flex items-center justify-end gap-1 md:gap-2 text-base md:text-lg">
                    <span className="text-primary"><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /></span>
                    <span className="hidden xs:inline">Desain elegan</span>
                    <span className="inline xs:hidden">Elegan</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 md:gap-2 text-base md:text-lg">
                    <span className="text-primary"><Pen className="w-4 h-4 md:w-5 md:h-5" /></span>
                    <span className="hidden xs:inline">Mudah dibuat</span>
                    <span className="inline xs:hidden">Mudah</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 md:gap-2 text-base md:text-lg">
                    <span className="text-primary"><Send className="w-4 h-4 md:w-5 md:h-5" /></span>
                    <span className="hidden xs:inline">Siap dibagikan</span>
                    <span className="inline xs:hidden">Dibagikan</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
                  <Button asChild size="lg" variant="outline" className="text-lg w-full sm:w-auto">
                    <Link to="/templates">
                      Lihat Template
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="text-lg w-full sm:w-auto">
                    <Link to="/register">Buat Undangan Sekarang</Link>
                  </Button>
                </div>
              </div>
              {/* Kanan: Gambar Ilustrasi */}
              <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                <img
                  src={heroImage}
                  alt="Ilustrasi Undangan Pernikahan Digital"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. Features Section --- */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Semua yang Kamu Butuhkan</h2>
              <p className="text-muted-foreground">Fitur lengkap buat hari spesialmu makin berkesan.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Feature icon={<CheckCircle />} title="Desain Kustom">
                Pilih dari banyak tema, warna, dan kombinasi font yang udah didesain profesional.
              </Feature>
              <Feature icon={<Heart />} title="Fitur Interaktif">
                Ada galeri foto, cerita cinta, amplop digital, sampai ucapan & konfirmasi kehadiran (RSVP).
              </Feature>
              <Feature icon={<Send />} title="Mudah Dibagikan">
                Bisa generate pesan WhatsApp personal ke tiap tamu, lengkap sama link undangan unik kamu.
              </Feature>
            </div>
          </div>
        </section>

        {/* --- 4. Template Preview Section --- */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Template Menawan Siap Pakai</h2>
              <p className="text-muted-foreground">Mulai dari desain yang cantik dan profesional, tinggal pilih aja!</p>
            </div>

            {/* Tampilkan 3 tema teratas sebagai highlight */}
            <div className="xl:mx-40">
              <TemplateGrid themes={themes.slice(0, 6)} actionType="register" />
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="ghost" size="lg">
                <Link to="/templates">
                  Lihat Semua Template &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- 5. Pricing Section --- */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Harga Website Undangan</h2>
              <p className="text-muted-foreground">
                Coba gratis dulu 24 jam, atau langsung aktifin undangan kamu selamanya cukup sekali bayar aja.
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
              <PricingTier
                tier="Gratis (Coba Dulu)"
                price={<Label className="text-3xl font-bold text-primary">Rp 0</Label>}
                description="Undangan aktif selama 24 jam. Cocok banget buat nyobain fitur dan lihat hasil undangan kamu."
                features={[
                  'Semua Tema Premium',
                  'Kustomisasi Warna & Font',
                  'Upload Musik & Galeri Foto',
                  'Amplop Digital',
                  'Tanpa Batas Tamu',
                  // 'Tanpa Iklan',
                  'Link Undangan Unik',
                  'RSVP & Ucapan',
                  'Aktif 24 Jam',
                ]}
                isPopular={false}
              />
              <PricingTier
                tier="Aktif Selamanya"
                price={
                  <Label>
                    <Label className="block line-through text-gray-400 text-lg mb-1">Rp 85k</Label>
                    <Label className="text-3xl font-bold text-primary">Rp 49k</Label>
                  </Label>
                }
                description="Bayar sekali aja, undangan kamu aktif selamanya. Semua fitur premium tanpa batas waktu!"
                features={[
                  'Semua Tema Premium',
                  'Kustomisasi Warna & Font',
                  'Upload Musik & Galeri Foto',
                  'Amplop Digital',
                  'Tanpa Batas Tamu',
                  // 'Tanpa Iklan',
                  'Link Undangan Unik',
                  'RSVP & Ucapan',
                  'Aktif Selamanya',
                ]}
                isPopular={true}
              />
            </div>
            {/* <div className="text-center mt-8 text-sm text-muted-foreground">
              <span>
                <b>Catatan:</b> Undangan gratis hanya aktif 24 jam setelah dibuat. Untuk mengaktifkan selamanya, lakukan pembayaran.
              </span>
            </div> */}
          </div>
        </section>

        {/* --- 5. Final Call to Action (CTA) Section --- */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Siap Mulai Cerita Kamu?</h2>
            <p className="max-w-xl mx-auto mb-6 text-muted-foreground">
              Yuk gabung bareng ribuan pasangan bahagia yang udah share kabar gembira mereka di sini.
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link to="/register">Buat Undangan Gratis</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* --- 6. Footer --- */}
      <footer className="py-8 bg-gray-100 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Menantikan. Semua hak cipta dilindungi.
        </div>
      </footer>
    </div>
  );
}