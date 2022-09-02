/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = []
export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = []
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'basic',
        icon    : 'heroicons_outline:home',
        link    : '/dashboard'
    },
    {
        id      : 'pages',
        title   : '👍 Contact with S.management',
        type    : 'basic',
        link    : '/apps/contacts-with-state-management'
    },
    {
        id      : 'apps1',
        title   : '🚫 Contact without S.management',
        type    : 'basic',
        link    : '/apps/contacts-without-state-management'

    }
];
