import { useState, useEffect, useCallback } from 'react';

import { apiService } from '../services/apiService';

export const useCases = (currentPage, selectedYear) => {
  const [cases, setCases] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/receive-case', {
        params: { page: currentPage, limit: 7 },
      });
      setCases(response.data.cases || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);
  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/receive-charts?year=${selectedYear}`);
      if (response.data && Array.isArray(response.data.body)) {
        setChartData(response.data.body.map((item) => ({
          month: item.month_name,
          completed: item.completed_count || 0,
          pending: item.pending_count || 0,
        })));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);
  useEffect(() => {
    fetchCases();
    fetchChartData();
  }, [fetchCases, fetchChartData]);
  return { cases, chartData, loading, totalPages };
};