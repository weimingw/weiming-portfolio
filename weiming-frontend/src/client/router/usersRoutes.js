const UsersBase = () => import('../base/MainContent.vue');
const LoginPage = () => import('../pages/users/LoginPage.vue');
const CreatePage = () => import('../pages/users/CreatePage.vue');
const UpdatePage = () => import('../pages/users/UpdatePage.vue');
const VerificationPage = () => import('../pages/users/VerificationPage.vue');
const LogoutPage = () => import('../pages/users/LogoutPage.vue');

import endpoints from '../../common/endpoints';

export default {
    path: endpoints.users.url,
    component: UsersBase,
    children: [{
        path: endpoints.users.pages.login.fullUrl,
        component: LoginPage,
        props: {
            className: 'usersPage layout-oneColumn layout-mediumWidth',
        },
    }, {
        path: endpoints.users.pages.create.fullUrl,
        component: CreatePage,
        props: {
            className: 'usersPage layout-oneColumn layout-mediumWidth',
        },
    }, {
        path: endpoints.users.pages.update.fullUrl,
        component: UpdatePage,
        props: {
            className: 'usersPage layout-oneColumn layout-mediumWidth',
        },
    }, {
        path: endpoints.users.pages.verify.fullUrl,
        component: VerificationPage,
        props: {
            className: 'usersPage layout-oneColumn layout-mediumWidth',
        },
    }, {
        path: endpoints.users.pages.logout.fullUrl,
        component: LogoutPage,
    }],
}