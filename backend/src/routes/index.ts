import {Router} from 'express';
import categoriesRoute from './categoriesRoute';
import customersRoute from './customersRoute';
import gamesRoute from './gamesRoute';
import rentalsRoute from './rentalsRoute';

const router = Router();

const routes = [
    {
        path: '/categories',
        route: categoriesRoute
    },
    {
        path: '/games',
        route: gamesRoute
    },
    {
        path: '/customers',
        route: customersRoute
    },
    {
        path: '/rentals',
        route: rentalsRoute
    }
];

routes.forEach(({path,route}) => router.use(path,route));
export default router;
