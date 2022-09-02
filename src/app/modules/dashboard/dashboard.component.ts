import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector     : 'dashboard',
    templateUrl  : './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit
{
    messageList: string[] = [];

    /**
     * Constructor
     */
    constructor(
        public authService: AuthService,
    )
    {
    }

    ngOnInit(): void {
    }


}
