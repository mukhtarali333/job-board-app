import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

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
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/auth/register/register').then(m => m.Register)
            },
            {
                path: 'profile',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./features/profile/profile').then(m => m.Profile)
            },
            {
                path: 'saved-jobs',
                loadComponent: () =>
                    import('./features/saved-jobs/saved-jobs').then(m => m.SavedJobs)
            },
            {
                path: 'post-job',
                canActivate: [authGuard],
                loadComponent: () => 
                    import('./features/post-job/post-job').then(m => m.PostJob)
            },
            {
                path: 'my-jobs',
                canActivate: [authGuard],
                loadComponent: () => 
                    import('./features/my-jobs/my-jobs').then(m => m.MyJobs)
            },
            {
                path: 'edit-job/:id',
                canActivate: [authGuard],
                loadComponent: () =>
                    import('./features/post-job/post-job').then(m => m.PostJob)
            }
        ]
    },
    {
        path: '**', redirectTo: ''
    }
];
