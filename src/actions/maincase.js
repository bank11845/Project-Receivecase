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
    console.log('Fetched Main Cases:', data);

    return data?.result ?? []; 
  } catch (error) {
    console.error('Error fetching main case:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------
export async function getSubCaseTypes() {
  try {
    const data = await fetcher(endpoints.dashboard.sub_case);

    console.log('Fetched Data:', data);

    const subCaseArray = data.body?.result ? JSON.parse(data.body.result) : [];

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
    return data.result;
  } catch (error) {
    console.error('Error fetching sub case:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function getlevelurgencies() {
  try {
    const data = await fetcher(endpoints.dashboard.levelurgencies);
    return data.result;
  } catch (error) {
    console.error('Error fetching main case:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function get_employee() {
  try {
    const data = await fetcher(endpoints.dashboard.get_employee);
    return data.result;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}

//------------------------------------------------------------------------------

export async function get_team() {
  try {
    const data = await fetcher(endpoints.dashboard.team);
    return data.result;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
}

//----------------------------------------------------------------------------------

export async function get_status() {
  try {
    const data = await fetcher(endpoints.dashboard.status);
    return data.result;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
}
