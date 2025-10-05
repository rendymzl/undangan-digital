import { useState } from 'react';
import FormWizard, { type WizardStep } from '@/components/shared/Forms/FormWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Step Components
const PersonalInfoStep = ({ data, onDataChange }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">Nama Depan</Label>
        <Input
          id="firstName"
          value={data?.firstName || ''}
          onChange={(e) => onDataChange({ ...data, firstName: e.target.value })}
          placeholder="Masukkan nama depan"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Nama Belakang</Label>
        <Input
          id="lastName"
          value={data?.lastName || ''}
          onChange={(e) => onDataChange({ ...data, lastName: e.target.value })}
          placeholder="Masukkan nama belakang"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data?.email || ''}
          onChange={(e) => onDataChange({ ...data, email: e.target.value })}
          placeholder="Masukkan email"
        />
      </div>
    </div>
  );
};

const ContactInfoStep = ({ data, onDataChange }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          value={data?.phone || ''}
          onChange={(e) => onDataChange({ ...data, phone: e.target.value })}
          placeholder="Masukkan nomor telepon"
        />
      </div>
      <div>
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          value={data?.address || ''}
          onChange={(e) => onDataChange({ ...data, address: e.target.value })}
          placeholder="Masukkan alamat lengkap"
          rows={3}
        />
      </div>
    </div>
  );
};

const ReviewStep = ({ data }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Review Informasi Anda</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Nama Depan</Label>
          <p className="text-sm">{data?.firstName || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Nama Belakang</Label>
          <p className="text-sm">{data?.lastName || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Email</Label>
          <p className="text-sm">{data?.email || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Telepon</Label>
          <p className="text-sm">{data?.phone || '-'}</p>
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-gray-600">Alamat</Label>
        <p className="text-sm">{data?.address || '-'}</p>
      </div>
    </div>
  );
};

export default function FormWizardDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 'personal',
      title: 'Informasi Personal',
      description: 'Masukkan informasi personal Anda',
      component: PersonalInfoStep,
      validation: () => {
        return !!(formData as any)?.firstName && !!(formData as any)?.lastName && !!(formData as any)?.email;
      }
    },
    {
      id: 'contact',
      title: 'Informasi Kontak',
      description: 'Masukkan informasi kontak Anda',
      component: ContactInfoStep,
      validation: () => {
        return !!(formData as any)?.phone;
      }
    },
    {
      id: 'review',
      title: 'Review & Konfirmasi',
      description: 'Periksa kembali informasi yang telah Anda masukkan',
      component: ReviewStep
    }
  ];

  const handleComplete = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setCompleted(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFormData({});
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h2>
            <p className="text-gray-600 mb-6">Formulir telah berhasil disubmit.</p>
            <Button onClick={handleReset}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Form Wizard Demo</h1>
        <p className="text-gray-600">Demonstrasi komponen FormWizard yang telah diperbaiki</p>
      </div>

      <FormWizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
        onCancel={handleReset}
        data={formData}
        onDataChange={setFormData}
        loading={loading}
        showProgress={true}
        showStepNumbers={true}
      />

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ FormWizard Component Fixed!</h3>
        <p className="text-green-700">
          Komponen FormWizard telah diperbaiki dan berfungsi dengan baik:
        </p>
        <ul className="list-disc list-inside mt-2 text-green-700 space-y-1">
          <li>Progress bar dengan persentase</li>
          <li>Step navigation dengan validasi</li>
          <li>Loading states dan error handling</li>
          <li>Responsive design</li>
          <li>TypeScript support penuh</li>
        </ul>
      </div>
    </div>
  );
}