import React from 'react';
import { PieChart, BarChart, LineChart } from '@/components/shared/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChartsDemo() {
  // Sample data for demonstrations
  const pieData = {
    labels: ['Undangan Aktif', 'Undangan Expired', 'Draft'],
    datasets: [{
      data: [45, 25, 15],
      backgroundColor: ['#10b981', '#f59e0b', '#6b7280'],
    }]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Undangan Dibuat',
      data: [12, 19, 8, 15, 22],
      backgroundColor: '#3b82f6',
    }]
  };

  const lineData = {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    datasets: [{
      label: 'RSVP Diterima',
      data: [65, 78, 90, 81],
      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf6',
    }]
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Charts Components Demo</h1>
        <p className="text-gray-600">Demonstrasi komponen chart yang telah diperbaiki</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart - Status Undangan</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={pieData}
              title="Distribusi Status Undangan"
              height={300}
              showLegend={true}
            />
          </CardContent>
        </Card>

        {/* Bar Chart Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Undangan per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={barData}
              title="Undangan Dibuat per Bulan"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Line Chart Demo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Line Chart - Trend RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={lineData}
              title="Trend RSVP Mingguan"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Horizontal Bar Chart Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Horizontal Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={barData}
              title="Undangan per Bulan (Horizontal)"
              height={300}
              horizontal={true}
            />
          </CardContent>
        </Card>

        {/* Pie Chart without Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart - Tanpa Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={pieData}
              title="Status Undangan (Compact)"
              height={300}
              showLegend={false}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Charts Components Fixed!</h3>
        <p className="text-green-700">
          Semua komponen chart telah diperbaiki dan berfungsi dengan baik:
        </p>
        <ul className="list-disc list-inside mt-2 text-green-700 space-y-1">
          <li>PieChart - Menggunakan SVG native dengan interaktivitas hover</li>
          <li>BarChart - Mendukung mode horizontal dan vertical</li>
          <li>LineChart - Dengan smooth curves dan area fill</li>
          <li>Semua chart responsive dan dapat dikustomisasi</li>
          <li>Tidak memerlukan dependency eksternal (chart.js, react-chartjs-2)</li>
        </ul>
      </div>
    </div>
  );
}