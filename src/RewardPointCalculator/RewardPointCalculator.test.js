// __tests__/RewardPointsCalculatorContent.test.js

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RewardPointsCalculator from './RewardPointCalculator';
import { fetchTransactions } from '../services/transactionService';
import { calculateRewardPoints } from '../utils/calculationUtils';

// Mock the imported modules
jest.mock('../services/transactionService');
jest.mock('../utils/calculationUtils');

describe('RewardPointsCalculator Content', () => {
  test('renders customer data and total points correctly', async () => {
    const transactions = [
      { customerId: 'cust101', transactionAmount: 120, transactionDate: '2024-06-15' },
      { customerId: 'cust101', transactionAmount: 75, transactionDate: '2024-06-25' },
    ];
    const rewardPointsByCustomer = {
      cust101: { '6': 265 }, 
    };
    const totalRewardPoints = 265;

    fetchTransactions.mockResolvedValue(transactions);
    calculateRewardPoints.mockReturnValue({ rewardPointsByCustomer, totalRewardPoints });

    render(<RewardPointsCalculator />);

    await waitFor(() => {
      expect(screen.getByText('Customer ID: cust101')).toBeInTheDocument();
    });
    // await waitFor(() => {
    //   expect(screen.getByText('Month: 6 - Points: 265')).toBeInTheDocument(); // Adjusted total points
    // });
  });

  test('renders loading state initially', () => {
    fetchTransactions.mockResolvedValue([]);
    calculateRewardPoints.mockReturnValue({ rewardPointsByCustomer: {}, totalRewardPoints: 0 });

    render(<RewardPointsCalculator />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test("renders error state when fetch fails", async () => {
    fetchTransactions.mockRejectedValue(new Error("Failed to fetch"));

    render(<RewardPointsCalculator />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });
  });

  test("displays no results message when no customers are found", async () => {
    fetchTransactions.mockResolvedValue([]);
    calculateRewardPoints.mockReturnValue({
      rewardPointsByCustomer: {},
      totalRewardPoints: 0,
    });

    render(<RewardPointsCalculator />);

    await waitFor(() => {
      expect(screen.getByText("No customers found")).toBeInTheDocument();
    });
  });
});
