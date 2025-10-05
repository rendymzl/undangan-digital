import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Star, 
  Gift, 
  Zap,
  CheckCircle, 
  X,
  AlertCircle,
  CreditCard,
  Calendar,
  Users,
  Template,
  Smartphone,
  BarChart3,
  Shield,
  Headphones,
  Globe
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from 'sonner';

interface PlanFeature {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  free: boolean | string;
  premium: boolean | string;
  ultimate: boolean | string;
  business: boolean | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: 'Undangan Aktif',
    icon: Template,
    free: '1',
    premium: '3',
    ultimate: 'Unlimited',
    business: 'Unlimited',
  },
  {
    name: 'Maksimal Tamu',
    icon: Users,
    free: '50',
    premium: '200',
    ultimate: 'Unlimited',
    business: 'Unlimited',
  },
  {
    name: 'Template Premium',
    icon: Star,
    free: '5 template',
    premium: '50+ template',
    ultimate: 'All + Exclusive',
    business: 'All + Custom',
  },
  {
    name: 'Customization',
    icon: BarChart3,
    free: 'Terbatas',
    premium: 'Full',
    ultimate: 'Full + CSS',
    business: 'Full + CSS',
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    free: 'Basic',
    premium: 'Advanced',
    ultimate: 'Premium',
    business: 'Enterprise',
  },
  {
    name: 'WhatsApp Bulk',
    icon: Smartphone,
    free: false,
    premium: true,
    ultimate: true,
    business: true,
  },
  {
    name: 'Custom Domain',
    icon: Globe,
    free: false,
    premium: false,
    ultimate: 'Subdomain',
    business: 'Full Domain',
  },
  {
    name: 'Priority Support',
    icon: Headphones,
    free: false,
    premium: 'Email',
    ultimate: 'WhatsApp',
    business: 'Dedicated',
  },
  {
    name: 'Watermark',
    icon: Shield,
    free: 'Ada',
    premium: 'Tidak Ada',
    ultimate: 'Tidak Ada',
    business: 'Tidak Ada',
  },
];

const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    duration: 'Selamanya',
    description: 'Cocok untuk mencoba fitur dasar',
    icon: Gift,
    color: 'gray',
    features: ['1 undangan', '50 tamu', '5 template', 'Basic analytics'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49000,
    duration: '30 hari',
    description: 'Pilihan terpopuler untuk pengguna individual',
    icon: Star,
    color: 'blue',
    isPopular: true,
    features: ['3 undangan', '200 tamu', '50+ template', 'Advanced analytics', 'Bulk WhatsApp'],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 89000,
    duration: '60 hari',
    description: 'Untuk power user dan small business',
    icon: Crown,
    color: 'purple',
    features: ['Unlimited undangan', 'Unlimited tamu', 'All templates', 'Custom domain', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 299000,
    duration: '365 hari',
    description: 'Solusi enterprise untuk wedding organizer',
    icon: Zap,
    color: 'gold',
    features: ['All Ultimate features', 'Multi-user', 'Custom branding', 'Dedicated support', 'SLA guarantee'],
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const [currentPlan] = useState('free'); // Mock current plan

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    toast.success(`Plan ${plans.find(p => p.id === planId)?.name} dipilih`);
    // Here you would typically redirect to payment page
  };

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Subscription"
        description="Pilih plan yang sesuai dengan kebutuhan Anda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pembayaran', href: '/dashboard/payments' },
          { label: 'Subscription' },
        ]}
      />

      {/* Current Plan Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Anda saat ini menggunakan plan <strong>Gratis</strong>. 
          Upgrade untuk mendapatkan fitur lebih lengkap dan menghilangkan batasan.
        </AlertDescription>
      </Alert>

      {/* Billing Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
              Bulanan
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
              Tahunan
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800">Hemat 20%</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = plan.id === currentPlan;
          const isSelected = plan.id === selectedPlan;
          
          return (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-lg ${
                plan.isPopular ? 'ring-2 ring-blue-500' : ''
              } ${isCurrentPlan ? 'bg-accent/50' : ''} ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Terpopuler</Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-2 right-4">
                  <Badge className="bg-green-600 text-white">Plan Aktif</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <Icon className={`h-12 w-12 mx-auto mb-4 text-${plan.color}-600`} />
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {plan.duration}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : isSelected ? "default" : "outline"}
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrentPlan ? (
                    'Plan Aktif'
                  ) : plan.price === 0 ? (
                    'Downgrade ke Gratis'
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pilih Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Sembunyikan' : 'Tampilkan'} Perbandingan Fitur
        </Button>
      </div>

      {/* Feature Comparison Table */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Fitur Lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Fitur</th>
                    <th className="text-center p-4">Gratis</th>
                    <th className="text-center p-4">Premium</th>
                    <th className="text-center p-4">Ultimate</th>
                    <th className="text-center p-4">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {planFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <tr key={index} className="border-b hover:bg-accent/50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                            {feature.name}
                          </div>
                        </td>
                        <td className="text-center p-4">
                          {renderFeatureValue(feature.free)}
                        </td>
                        <td className="text-center p-4">
                          {renderFeatureValue(feature.premium)}
                        </td>
                        <td className="text-center p-4">
                          {renderFeatureValue(feature.ultimate)}
                        </td>
                        <td className="text-center p-4">
                          {renderFeatureValue(feature.business)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pertanyaan Umum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Apakah saya bisa upgrade/downgrade kapan saja?</h4>
            <p className="text-sm text-muted-foreground">
              Ya, Anda bisa upgrade atau downgrade plan kapan saja. Perubahan akan berlaku segera 
              dan billing akan disesuaikan secara proporsional.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Bagaimana jika saya membatalkan subscription?</h4>
            <p className="text-sm text-muted-foreground">
              Anda tetap bisa menggunakan fitur premium hingga periode berakhir. 
              Setelah itu, akun akan otomatis downgrade ke plan gratis.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Apakah ada garansi uang kembali?</h4>
            <p className="text-sm text-muted-foreground">
              Ya, kami menyediakan garansi uang kembali 7 hari untuk semua plan berbayar 
              tanpa pertanyaan yang rumit.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      {selectedPlan && selectedPlan !== currentPlan && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Siap upgrade ke {plans.find(p => p.id === selectedPlan)?.name}?
            </h3>
            <p className="text-muted-foreground mb-4">
              Dapatkan akses ke semua fitur premium dan tingkatkan pengalaman undangan digital Anda.
            </p>
            <Button size="lg" className="mr-4">
              <CreditCard className="h-4 w-4 mr-2" />
              Lanjutkan Pembayaran
            </Button>
            <Button variant="outline" size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              Jadwalkan Demo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}