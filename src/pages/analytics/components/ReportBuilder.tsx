import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  Settings,
  Eye,
  Users,
  MessageSquare,
  Globe,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportConfig {
  name: string;
  description: string;
  dateRange: string;
  invitations: string[];
  metrics: string[];
  format: 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includeInsights: boolean;
}

interface ReportBuilderProps {
  availableInvitations: Array<{ id: string; title: string }>;
  onGenerateReport: (config: ReportConfig) => void;
  className?: string;
}

const availableMetrics = [
  { id: 'views', name: 'Views & Traffic', icon: Eye, description: 'Total views, unique visitors, daily trends' },
  { id: 'engagement', name: 'Engagement', icon: TrendingUp, description: 'Time on page, bounce rate, section views' },
  { id: 'rsvp', name: 'RSVP Analytics', icon: MessageSquare, description: 'Response rates, category breakdown' },
  { id: 'geographic', name: 'Geographic Data', icon: Globe, description: 'Country and city distribution' },
  { id: 'devices', name: 'Device Analytics', icon: Smartphone, description: 'Desktop, mobile, tablet usage' },
  { id: 'demographics', name: 'Demographics', icon: Users, description: 'Guest categories and preferences' },
];

const dateRangeOptions = [
  { value: '7d', label: '7 Hari Terakhir' },
  { value: '30d', label: '30 Hari Terakhir' },
  { value: '90d', label: '90 Hari Terakhir' },
  { value: '1y', label: '1 Tahun Terakhir' },
  { value: 'all', label: 'Semua Waktu' },
];

export default function ReportBuilder({
  availableInvitations,
  onGenerateReport,
  className,
}: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dateRange: '30d',
    invitations: [],
    metrics: ['views', 'engagement', 'rsvp'],
    format: 'pdf',
    includeCharts: true,
    includeInsights: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInvitationToggle = (invitationId: string) => {
    setConfig(prev => ({
      ...prev,
      invitations: prev.invitations.includes(invitationId)
        ? prev.invitations.filter(id => id !== invitationId)
        : [...prev.invitations, invitationId]
    }));
  };

  const handleMetricToggle = (metricId: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const handleSelectAllInvitations = () => {
    setConfig(prev => ({
      ...prev,
      invitations: prev.invitations.length === availableInvitations.length 
        ? [] 
        : availableInvitations.map(inv => inv.id)
    }));
  };

  const handleSelectAllMetrics = () => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.length === availableMetrics.length 
        ? [] 
        : availableMetrics.map(metric => metric.id)
    }));
  };

  const handleGenerateReport = async () => {
    if (!config.name.trim()) {
      toast.error('Nama report wajib diisi');
      return;
    }

    if (config.invitations.length === 0) {
      toast.error('Pilih minimal satu undangan');
      return;
    }

    if (config.metrics.length === 0) {
      toast.error('Pilih minimal satu metrik');
      return;
    }

    setIsGenerating(true);
    
    try {
      await onGenerateReport(config);
      toast.success('Report berhasil dibuat');
      
      // Reset form
      setConfig({
        name: '',
        description: '',
        dateRange: '30d',
        invitations: [],
        metrics: ['views', 'engagement', 'rsvp'],
        format: 'pdf',
        includeCharts: true,
        includeInsights: true,
      });
    } catch (error) {
      toast.error('Gagal membuat report');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSelectedInvitationsText = () => {
    if (config.invitations.length === 0) return 'Belum ada yang dipilih';
    if (config.invitations.length === availableInvitations.length) return 'Semua undangan';
    return `${config.invitations.length} undangan dipilih`;
  };

  const getSelectedMetricsText = () => {
    if (config.metrics.length === 0) return 'Belum ada yang dipilih';
    if (config.metrics.length === availableMetrics.length) return 'Semua metrik';
    return `${config.metrics.length} metrik dipilih`;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Report Builder
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Buat laporan analytics kustom dengan metrik dan filter yang Anda pilih
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Report</label>
                <Input
                  placeholder="Contoh: Analytics Report Januari 2024"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Periode</label>
                <select
                  value={config.dateRange}
                  onChange={(e) => setConfig(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Deskripsi (Opsional)</label>
              <Input
                placeholder="Deskripsi singkat tentang report ini"
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Invitation Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Pilih Undangan</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllInvitations}
              >
                {config.invitations.length === availableInvitations.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {getSelectedInvitationsText()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {availableInvitations.map(invitation => (
                <div key={invitation.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={config.invitations.includes(invitation.id)}
                    onCheckedChange={() => handleInvitationToggle(invitation.id)}
                  />
                  <span className="text-sm">{invitation.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Pilih Metrik</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllMetrics}
              >
                {config.metrics.length === availableMetrics.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {getSelectedMetricsText()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableMetrics.map(metric => {
                const Icon = metric.icon;
                const isSelected = config.metrics.includes(metric.id);
                
                return (
                  <div
                    key={metric.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleMetricToggle(metric.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleMetricToggle(metric.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{metric.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Format and Options */}
          <div className="space-y-4">
            <h3 className="font-semibold">Format & Opsi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Format Output</label>
                <select
                  value={config.format}
                  onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as 'pdf' | 'csv' | 'json' }))}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="pdf">PDF Report</option>
                  <option value="csv">CSV Data</option>
                  <option value="json">JSON Data</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={config.includeCharts}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCharts: !!checked }))}
                />
                <div>
                  <div className="text-sm font-medium">Sertakan Charts</div>
                  <div className="text-xs text-muted-foreground">Grafik dan visualisasi data</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={config.includeInsights}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeInsights: !!checked }))}
                />
                <div>
                  <div className="text-sm font-medium">Sertakan Insights</div>
                  <div className="text-xs text-muted-foreground">Analisis dan rekomendasi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold">Preview Report</h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">{config.name || 'Nama Report'}</div>
                  <div className="text-sm text-muted-foreground">
                    {config.description || 'Deskripsi report'}
                  </div>
                </div>
                <Badge variant="outline">
                  {dateRangeOptions.find(opt => opt.value === config.dateRange)?.label}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Undangan:</span>
                  <span className="ml-2">{getSelectedInvitationsText()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Metrik:</span>
                  <span className="ml-2">{getSelectedMetricsText()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <span className="ml-2">{config.format.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Opsi:</span>
                  <span className="ml-2">
                    {config.includeCharts && 'Charts'} 
                    {config.includeCharts && config.includeInsights && ', '}
                    {config.includeInsights && 'Insights'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !config.name.trim() || config.invitations.length === 0 || config.metrics.length === 0}
              className="flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Settings className="h-4 w-4 animate-spin" />
                  <span>Membuat Report...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}