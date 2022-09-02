import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Contact, Country, Tag } from 'app/modules/contacts/contacts.types';
import { environment } from 'environments/environment';
import { FuseMockApiUtils } from '@fuse/lib/mock-api';

@Injectable({
    providedIn: 'root'
})
export class ContactsService
{
    // Private
    private _contact: BehaviorSubject<Contact | null> = new BehaviorSubject(null);
    private _contacts: BehaviorSubject<Contact[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get contact$(): Observable<Contact>
    {
        return this._contact.asObservable();
    }

    /**
     * Getter for contacts
     */
    get contacts$(): Observable<Contact[]>
    {
        return this._contacts.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get contacts
     */
    getContacts(): Observable<Contact[]>
    {
        return this._httpClient.get<Contact[]>(`${environment.apiUrl}/contacts`).pipe(
            tap((contacts) => {
                console.log('Data called by resolver =====>', contacts)
                this._contacts.next(contacts);
            })
        );
    }

    /**
     * Get contacts
     */
    fetchContacts(): Observable<Contact[]> {
        return this._httpClient.get<Contact[]>(`${environment.apiUrl}/contacts`).pipe(
            tap((contacts) => {
                console.log('Refectch Data =====>', contacts)
                this._contacts.next(contacts);
            })
        );
    }

    /**
     * Search contacts with given query
     *
     * @param query
     */
    searchContacts(query: string): Observable<Contact[]>
    {
        return this._httpClient.get<Contact[]>('api/apps/contacts/search', {
            params: {query}
        }).pipe(
            tap((contacts) => {
                this._contacts.next(contacts);
            })
        );
    }

    /**
     * Get contact by id
     */
    getContactById(id: string): Observable<Contact>
    {
        return this._httpClient.get<Contact>(`${environment.apiUrl}/contacts/${id}`).pipe(
            tap((contact) => {
                console.log('Get contact By ID =====>', contact)
                this._contact.next(contact);
            })
        );
    }

    /**
     * Create contact
     */
    createContact(): Observable<Contact>
    {
        const payload = this.fakeNewContactClass()
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>(`${environment.apiUrl}/contacts`, payload).pipe(
                map((newContact) => {

                    // Update the contacts with the new contact
                    this._contacts.next([newContact, ...contacts]);
                    console.log('New contact added and State Updated')
                    // Return the new contact
                    return newContact;
                })
            ))
        );
    }

    /**
     * Create contact thw classic way without state management
     */
     createContactClassicaly(): Observable<Contact> {
        const payload = this.fakeNewContactClass()
        return this._httpClient.post<Contact>(`${environment.apiUrl}/contacts`, payload).pipe(
            map((newContact) => {
                // Return the new contact
                return newContact;
            })
        )
    }

    /**
     * Update contact
     *
     * @param id
     * @param contact
     */
    updateContact(id: string, contact: Contact): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.patch<Contact>(`${environment.apiUrl}/contacts/${id}`, contact).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }


    /**
     * Update contact the classic way without State management
     *
     * @param id
     * @param contact
     */
     updateContactClassicaly(id: string, contact: Contact): Observable<Contact>
     {
         return this._httpClient.patch<Contact>(`${environment.apiUrl}/contacts/${id}`, contact)
         .pipe(
            map((updatedContact) => {
                // Return the updated contact
                return updatedContact;
            })
         );
     }

    /**
     * Delete the contact
     *
     * @param id
     */
    deleteContact(id: string): Observable<boolean>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.delete(`${environment.apiUrl}/contacts/${id}`).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Delete the contact
                    contacts.splice(index, 1);

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * Delete contact the classic way without state management
     *
     * @param id
     */
     deleteContactClassicaly(id: string): Observable<boolean>
     {
         return this._httpClient.delete(`${environment.apiUrl}/contacts/${id}`).pipe(
            map((isDeleted: boolean) => {
                // Return the deleted status
                return isDeleted;
            })
        )
     }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        return this._httpClient.get<Country[]>('api/apps/contacts/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }

    /**
     * Get tags
     */
    getTags(): Observable<Tag[]>
    {
        return this._httpClient.get<Tag[]>('api/apps/contacts/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/contacts/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/contacts/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/contacts/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.contacts$.pipe(
                    take(1),
                    map((contacts) => {

                        // Iterate through the contacts
                        contacts.forEach((contact) => {

                            const tagIndex = contact.tags.findIndex(tag => tag === id);

                            // If the contact has the tag, remove it
                            if ( tagIndex > -1 )
                            {
                                contact.tags.splice(tagIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }

    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }


    /*
     * Faking a new contact payload
     */
    fakeNewContactClass() {
        // Generate a new contact
        return {
            id          : FuseMockApiUtils.guid(),
            avatar      : null,
            name        : 'New Contact',
            emails      : [],
            phoneNumbers: [],
            job         : {
                title  : '',
                company: ''
            },
            birthday    : null,
            address     : null,
            notes       : null,
            tags        : []
        };
    }
}
