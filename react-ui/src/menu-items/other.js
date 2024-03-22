// assets
import { IconPencil, IconHelp, IconSitemap,IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconPencil: IconPencil,
    IconHelp: IconHelp,
    IconSitemap: IconSitemap,
    IconSettings: IconSettings
};

//-----------------------|| Settings & DOCUMENTATION MENU ITEMS ||-----------------------//

export const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'positions',
            title: 'Positions',
            type: 'item',
            url: '/positions',
            icon: icons['IconPencil'],
            breadcrumbs: false
        },
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/settings',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
     /*   {
            id: 'documentation',
            title: 'Documentation',
            type: 'item',
            url: 'https://docs.appseed.us/products/react/flask-berry-dashboard',
            icon: icons['IconHelp'],
            external: true,
            target: true
        }*/
    ]
};
