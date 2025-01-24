export const formatDateTime = (dateString) => {
  if (!dateString) return 'ไม่ระบุ';
  
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'ข้อมูลผิดพลาด';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = (date.getFullYear() + 543).toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
