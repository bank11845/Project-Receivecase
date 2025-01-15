import { Icon } from '@iconify/react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Receive Case',
    items: [
      {
        title: 'Recieve Case',
        path: paths.dashboard.rcc.root,
        icon: <Icon icon="ant-design:alert-outlined" />,
        children: [
          // {
          //   title: 'Recieve Case',
          //   path: paths.dashboard.rcc.root,
          //   icon: <Icon icon="ant-design:alert-outlined" />,
          // },
          // {
          //   title: 'History',
          //   path: paths.dashboard.rcc.history,
          //   icon: <Icon icon="ant-design:history-outlined" />,
          // },
          // {
          //   title: 'Analystics',
          //   path: paths.dashboard.rcc.analystics,
          //   icon: <Icon icon="ant-design:line-chart-outlined" />,
          // },

          {
            title: 'Receive Case Report',
            path: paths.dashboard.root,
            icon: <Icon icon="ant-design:alert-outlined" />,
          },
          {
            title: 'History',
            path: paths.dashboard.two,
            icon: <Icon icon="ant-design:history-outlined" />,
          },
          {
            title: 'Analystics',
            path: paths.dashboard.three,
            icon: <Icon icon="ant-design:line-chart-outlined" />,
          },
        ],
      },
    ],
  },
  /**
   * Management
   */
];
