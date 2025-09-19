import React from 'react';
import { render, screen } from '@testing-library/react';
import { SimpleGrid, type SimpleColumn } from './SimpleGrid';

describe('SimpleGrid', () => {
  const mockColumns: SimpleColumn[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  it('renders column headers correctly', () => {
    render(<SimpleGrid columns={mockColumns} data={mockData} />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders data rows correctly', () => {
    render(<SimpleGrid columns={mockColumns} data={mockData} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<SimpleGrid columns={mockColumns} data={[]} />);
    
    // Headers should still be rendered
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('uses custom render function when provided', () => {
    const columnsWithRender: SimpleColumn[] = [
      ...mockColumns,
      {
        field: 'status',
        headerName: 'Status',
        render: (value) => <span data-testid="custom-status">{value?.toUpperCase()}</span>,
      },
    ];

    const dataWithStatus = [
      { ...mockData[0], status: 'active' },
    ];

    render(<SimpleGrid columns={columnsWithRender} data={dataWithStatus} />);
    
    const customElement = screen.getByTestId('custom-status');
    expect(customElement).toHaveTextContent('ACTIVE');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SimpleGrid columns={mockColumns} data={mockData} className="custom-grid" />
    );
    
    expect(container.firstChild).toHaveClass('custom-grid');
  });

  it('sets custom height', () => {
    const { container } = render(
      <SimpleGrid columns={mockColumns} data={mockData} height={500} />
    );
    
    expect(container.firstChild).toHaveStyle({ height: '500px' });
  });
});