import { homeRoutes } from './home';
import { groupsRoutes } from './groups';
import { notesRoutes, noteEditRoute } from './notes';
import type { AppRouteRecordRaw } from 'vue-router';

export const routeModules: AppRouteRecordRaw[] = [homeRoutes, groupsRoutes, notesRoutes, noteEditRoute];
