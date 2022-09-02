import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/modules/dashboard/dashboard.component';

const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(dashboardRoutes)
    ]
})
export class DashboardModule
{
}
