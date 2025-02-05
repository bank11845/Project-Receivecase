import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/utils/axios';

export function useGetReceivecase() {
  const url = endpoints.dashboard.receivecaseJoin;

  const [Rec, setRec] = useState([]); // เก็บข้อมูลที่ได้รับจาก API
  const [isLoading, setIsLoading] = useState(false); // เก็บสถานะการโหลดข้อมูล
  const [error, setError] = useState(null); // เก็บข้อมูลข้อผิดพลาด
  const hasFetched = useRef(false); // ตรวจสอบว่าได้ทำการดึงข้อมูลแล้ว

  const fetchReceivecase = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setError(null);
    setIsLoading(true);

    let attempts = 0; // ตัวแปรนับจำนวนรอบที่ยิง API
    const maxRetries = 2; // ยิงซ้ำสูงสุด 2 รอบ

    while (attempts <= maxRetries) {
      try {
        console.log(`📌 Attempt ${attempts + 1}: Fetching data from`, url);
        // eslint-disable-next-line no-await-in-loop
        const response = await axiosInstance.get(url);

        if (response.status === 200) {
          if (response.headers['content-type'].includes('application/json')) {
            console.log('📌 API Data:', response.data);
            setRec(response.data); 
            setIsLoading(false);
            return;
          }
          throw new Error('Received non-JSON data');
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (err) {
        console.error(`❌ Attempt ${attempts + 1} Failed:`, err.message);
        // eslint-disable-next-line no-plusplus
        attempts++;

        if (attempts > maxRetries) {
          setError(err.message || 'An error occurred');
          setIsLoading(false);
        } else {
          console.log('🔄 Retrying...');
        }
      }
    }
  }, [url]);

  useEffect(() => {
    fetchReceivecase(); // เรียกฟังก์ชันเพื่อดึงข้อมูล
  }, [fetchReceivecase]);

  const memoizedValue = useMemo(
    () => ({
      Receivecase: Rec,
      ReceivecaseLoading: isLoading,
      ReceivecaseError: error,
      refetchReceivecase: fetchReceivecase,
    }),
    [Rec, isLoading, error, fetchReceivecase]
  );

  return memoizedValue;
}
