import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
  Zap,
  Star,
  Gift,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/shared/Charts';

// Types for subscription plans
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  limits: {
    invitations: number | 'unlimited';
    guests: number | 'unlimited';
    templates: number | 'unlimited';
    validity: number; // days
  };
  isPopular?: boolean;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
  remainingDays: number;
  usageStats: {
    invitationsUsed: number;
    guestsUsed: number;
    templatesUsed: number;
  };
}

// Subscription plans data
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    duration: 0, // permanent
    features: [
      '1 undangan aktif',
      'Maksimal 50 tamu',
      '5 template dasar',
      'Customization terbatas',
      'RSVP tracking dasar',
      'Watermark Menantikan'
    ],
    limits: {
      invitations: 1,
      guests: 50,
      templates: 5,
      validity: 30,
    },
    color: 'gray',
    icon: Gift,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 49000,
    duration: 30,
    features: [
      '3 undangan aktif',
      'Maksimal 200 tamu',
      '50+ template premium',
      'Full customization',
      'Advanced analytics',
      'Tanpa watermark',
      'Bulk WhatsApp sending'
    ],
    limits: {
      invitations: 3,
      guests: 200,
      templates: 50,
      validity: 60,
    },
    isPopular: true,
    color: 'blue',
    icon: Star,
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 89000,
    duration: 60,
    features: [
      'Unlimited undangan',
      'Unlimited tamu',
      'Semua template + exclusive',
      'Custom CSS',
      'Custom domain',
      'Priority support',
      'API access'
    ],
    limits: {
      invitations: 'unlimited',
      guests: 'unlimited',
      templates: 'unlimited',
      validity: 90,
    },
    color: 'purple',
    icon: Crown,
  },
  {
    id: 'business',
    name: 'Business',
    price: 299000,
    duration: 365,
    features: [
      'Semua fitur Ultimate',
      'Multi-user dashboard',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'Training & onboarding'
    ],
    limits: {
      invitations: 'unlimited',
      guests: 'unlimited',
      templates: 'unlimited',
      validity: 365,
    },
    color: 'gold',
    icon: Zap,
  },
];

// Mock user subscription data
const mockUserSubscription: UserSubscription = {
  id: 'sub_123',
  planId: 'premium',
  planName: 'Premium',
  status: 'active',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  autoRenew: true,
  price: 49000,
  remainingDays: 15,
  usageStats: {
    invitationsUsed: 2,
    guestsUsed: 85,
    templatesUsed: 12,
  },
};

// Mock usage data for chart
const usageData = [
  { date: '1 Jan', invitations: 0, guests: 0 },
  { date: '5 Jan', invitations: 1, guests: 25 },
  { date: '10 Jan', invitations: 1, guests: 45 },
  { date: '15 Jan', invitations: 2, guests: 65 },
  { date: '20 Jan', invitations: 2, guests: 85 },
];

export default function PaymentDashboardPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = subscriptionPlans.find(p => p.id === mockUserSubscription.planId);
  const isExpiringSoon = mockUserSubscription.remainingDays <= 7;
  const usagePercentage = currentPlan ? {
    invitations: currentPlan.limits.invitations === 'unlimited' ? 0 : 
      (mockUserSubscription.usageStats.invitationsUsed / (currentPlan.limits.invitations as number)) * 100,
    guests: currentPlan.limits.guests === 'unlimited' ? 0 : 
      (mockUserSubscription.usageStats.guestsUsed / (currentPlan.limits.guests as number)) * 100,
  } : { invitations: 0, guests: 0 };

  const getStatusBadge = (status: UserSubscription['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'expired':
        return <Badge variant="destructive">Kedaluwarsa</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Dibatalkan</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlanIcon = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return Gift;
    return plan.icon;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Pembayaran"
        description="Kelola subscription dan riwayat pembayaran Anda"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pembayaran' },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        }
      />

      {/* Current Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                {React.createElement(getPlanIcon(mockUserSubscription.planId), { 
                  className: "h-5 w-5 mr-2" 
                })}
                Subscription Aktif
              </CardTitle>
              {getStatusBadge(mockUserSubscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Plan Saat Ini</div>
                <div className="text-2xl font-bold">{mockUserSubscription.planName}</div>
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(mockUserSubscription.price)} / {currentPlan?.duration} hari
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Berakhir Pada</div>
                <div className="text-lg font-semibold">
                  {mockUserSubscription.endDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mockUserSubscription.remainingDays} hari tersisa
                </div>
              </div>
            </div>

            {isExpiringSoon && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Subscription Anda akan berakhir dalam {mockUserSubscription.remainingDays} hari. 
                  Perpanjang sekarang untuk menghindari gangguan layanan.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Auto Renewal:</span>
                {mockUserSubscription.autoRenew ? (
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                ) : (
                  <Badge variant="outline">Nonaktif</Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Kelola Auto Renewal
                </Button>
                <Button size="sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Penggunaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Undangan</span>
                <span className="text-sm text-muted-foreground">
                  {mockUserSubscription.usageStats.invitationsUsed} / {
                    currentPlan?.limits.invitations === 'unlimited' ? '∞' : currentPlan?.limits.invitations
                  }
                </span>
              </div>
              {currentPlan?.limits.invitations !== 'unlimited' && (
                <Progress value={usagePercentage.invitations} className="h-2" />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tamu</span>
                <span className="text-sm text-muted-foreground">
                  {mockUserSubscription.usageStats.guestsUsed} / {
                    currentPlan?.limits.guests === 'unlimited' ? '∞' : currentPlan?.limits.guests
                  }
                </span>
              </div>
              {currentPlan?.limits.guests !== 'unlimited' && (
                <Progress value={usagePercentage.guests} className="h-2" />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Template</span>
                <span className="text-sm text-muted-foreground">
                  {mockUserSubscription.usageStats.templatesUsed} / {
                    currentPlan?.limits.templates === 'unlimited' ? '∞' : currentPlan?.limits.templates
                  }
                </span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Periode: {mockUserSubscription.startDate.toLocaleDateString('id-ID')} - {mockUserSubscription.endDate.toLocaleDateString('id-ID')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Penggunaan</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={usageData}
            xKey="date"
            yKey="guests"
            color="#3b82f6"
            height={300}
          />
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pilih plan yang sesuai dengan kebutuhan Anda
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === mockUserSubscription.planId;
              
              return (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    plan.isPopular ? 'ring-2 ring-blue-500' : ''
                  } ${isCurrentPlan ? 'bg-accent/50' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Populer</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 text-${plan.color}-600`} />
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                    </div>
                    {plan.duration > 0 && (
                      <div className="text-sm text-muted-foreground">
                        / {plan.duration} hari
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-muted-foreground">
                          +{plan.features.length - 4} fitur lainnya
                        </li>
                      )}
                    </ul>
                    
                    <Button
                      className="w-full mt-4"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Plan Aktif' : 'Pilih Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment History Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Riwayat Pembayaran Terbaru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/payments/history">
                Lihat Semua
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Premium Plan</div>
                <div className="text-sm text-muted-foreground">1 Januari 2024</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(49000)}</div>
                <Badge className="bg-green-100 text-green-800">Berhasil</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Premium Plan</div>
                <div className="text-sm text-muted-foreground">1 Desember 2023</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(49000)}</div>
                <Badge className="bg-green-100 text-green-800">Berhasil</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}