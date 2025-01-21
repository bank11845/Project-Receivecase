import { CONFIG } from 'src/config-global';

import { ReceiveCaseView } from 'src/sections/receive-case';



// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ReceiveCaseView />;
}
