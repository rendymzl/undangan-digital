// Analytics data types
export interface InvitationAnalytics {
  invitationId: string;
  views: {
    total: number;
    unique: number;
    daily: Array<{ date: Date; count: number }>;
  };
  engagement: {
    averageTimeOnPage: number;
    bounceRate: number;
    mostViewedSections: string[];
  };
  rsvp: {
    responseRate: number;
    responseTime: number; // average days to respond
    categoryBreakdown: Record<string, number>;
  };
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}