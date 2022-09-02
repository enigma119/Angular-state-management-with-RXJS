import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/contacts/contacts.guards';
import { ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from 'app/modules/contacts/contacts.resolvers';
import { ContactsWithoutStateManagementComponent } from './contacts.component';
import { ContactsContactWithoutStateManagementResolver } from './contacts.resolvers';
import { ContactsDetailsWithoutStateManagementComponent } from './details/details.component';
import { ContactsListWithoutStateManagementComponent } from './list/list.component';

export const contactsWithoutStateManagementRoutes: Route[] = [
    {
        path     : '',
        component: ContactsWithoutStateManagementComponent,
        resolve  : {
            tags: ContactsTagsResolver
        },
        children : [
            {
                path     : '',
                component: ContactsListWithoutStateManagementComponent,
                resolve  : {
                    contacts : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsWithoutStateManagementComponent,
                        resolve      : {
                            contact  : ContactsContactWithoutStateManagementResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
