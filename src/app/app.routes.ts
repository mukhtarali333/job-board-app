import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/home/home').then(m => m.Home),
            },
            {
                path: 'jobs/:id',
                loadComponent: () =>
                    import('./features/jobs/jobs-detail/jobs-detail').then(m => m.JobsDetail),
            },
            {
                path: 'jobs',
                loadComponent: () =>
                    import('./features/jobs/jobs-list/jobs-list').then(m => m.JobsList),
            },
        ]
    },
    {
        path: '**', redirectTo: ''
    }
];
