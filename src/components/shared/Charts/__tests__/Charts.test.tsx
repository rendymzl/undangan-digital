import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PieChart, BarChart, LineChart } from '../index';

describe('Charts Components', () => {
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Test Data',
      data: [10, 20, 30],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
    }]
  };

  describe('PieChart', () => {
    it('renders without crashing', () => {
      render(<PieChart data={mockData} title="Test Pie Chart" />);
      expect(screen.getByText('Test Pie Chart')).toBeInTheDocument();
    });

    it('displays legend when showLegend is true', () => {
      render(<PieChart data={mockData} showLegend={true} />);
      expect(screen.getByText('Jan: 10 (16.7%)')).toBeInTheDocument();
      expect(screen.getByText('Feb: 20 (33.3%)')).toBeInTheDocument();
      expect(screen.getByText('Mar: 30 (50.0%)')).toBeInTheDocument();
    });

    it('hides legend when showLegend is false', () => {
      render(<PieChart data={mockData} showLegend={false} />);
      expect(screen.queryByText('Jan: 10 (16.7%)')).not.toBeInTheDocument();
    });
  });

  describe('BarChart', () => {
    it('renders without crashing', () => {
      render(<BarChart data={mockData} title="Test Bar Chart" />);
      expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
    });

    it('renders horizontal bars when horizontal prop is true', () => {
      const { container } = render(<BarChart data={mockData} horizontal={true} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('LineChart', () => {
    it('renders without crashing', () => {
      render(<LineChart data={mockData} title="Test Line Chart" />);
      expect(screen.getByText('Test Line Chart')).toBeInTheDocument();
    });

    it('renders with custom height', () => {
      const { container } = render(<LineChart data={mockData} height={400} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '400');
    });
  });
});