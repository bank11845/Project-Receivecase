import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export async function getMainCase() {
  try {
    const data = await fetcher(endpoints.dashboard.main_case);
    return data;
  } catch (error) {
    console.error('Error fetching main case:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}
// ----------------------------------------------------------------------
export async function getSubcaseData() {
  try {
    const data = await fetcher(endpoints.dashboard.sub_case);

    const subCaseArray = JSON.parse(data.body);

    return subCaseArray; 
  } catch (error) {
    console.error('Error fetching sub case:', error);
    throw error; 
  }
}

// ----------------------------------------------------------------------
export async function getbranchs() {
  try {
    const data = await fetcher(endpoints.dashboard.branches);
    return data.body;
  } catch (error) {
    console.error('Error fetching sub case:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}

// ----------------------------------------------------------------------

export async function getlevelurgencies() {
  try {
    const data = await fetcher(endpoints.dashboard.levelurgencies);
    return data.body;
  } catch (error) {
    console.error('Error fetching main case:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}

// ----------------------------------------------------------------------

export async function get_employee() {
  try {
    const data = await fetcher(endpoints.dashboard.get_employee);
    return data.body;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}

//------------------------------------------------------------------------------

export async function get_team() {
  try {
    const data = await fetcher(endpoints.dashboard.team);
    return data.body;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}

//----------------------------------------------------------------------------------

export async function get_status() {
  try {
    const data = await fetcher(endpoints.dashboard.status);
    return data.body;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error; // เพื่อให้เรียกฟังก์ชันนี้ในที่อื่น ๆ รู้ว่ามีข้อผิดพลาด
  }
}
