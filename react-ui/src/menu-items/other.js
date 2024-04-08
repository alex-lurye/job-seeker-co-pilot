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
            id: 'resume',
            title: 'Resume',
            type: 'item',
            url: '/resume',
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
