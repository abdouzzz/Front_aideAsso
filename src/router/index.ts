import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';
import UserModel from '@/models/UserModel';
import { defineAsyncComponent, ref } from 'vue';
import { useUserService } from '@/composables/user/UserService';

const userService = useUserService();
const user = ref<UserModel | null>(null);

// Définir le composant de manière asynchrone
const TableauDeBord = defineAsyncComponent(() =>
  import('@/views/TableauDeBord.vue')
);

const AssoDetail = defineAsyncComponent(() => import('@/views/asso-detail.vue'));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: App,
      children: [
        {
          path: '/',
          name: 'accueil',
          component: () => import('@/views/Accueil.vue'),
        },
        {
          path: '/tableau-de-bord',
          name: 'tableau-de-bord',
          component: TableauDeBord,
          meta: { requiresAuth: true },
        },
        {
          path: '/asso-detail',
          name: 'asso-detail',
          component: AssoDetail,
          meta: { requiresAuth: true },
        },
        {
          path: '/benevoles',
          name: 'benevoles',
          component: () => import('@/views/benevole.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/test',
          name: 'test',
          component: () => import('@/views/test.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/:notFound(.*)',
      redirect: '/',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginUser.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpUser.vue'),
    },
  ],
});

export function isAuthenticated() {
  return !!sessionStorage.getItem('jwt'); // Vérifie si un token JWT est stocké
}

router.beforeEach(async (to, from, next) => {
  // Vérifie si la route requiert une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
      next({ name: 'login' });
    } else {
      // Si l'utilisateur est authentifié, charge les données de l'utilisateur
      await fetchData();
      next();
    }
  } else {
    // Si aucune authentification n'est nécessaire, continue normalement
    next();
  }
});

async function fetchData() {
  const jwt = sessionStorage.getItem('jwt');
  if (jwt) {
    try {
      const userData = await userService.getUserById(Number(jwt));
      user.value = userData;
      console.log('Utilisateur connecté:', user.value);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      user.value = null; // En cas d'erreur, réinitialise l'utilisateur
    }
  } else {
    user.value = null; // Aucun utilisateur n'est connecté
  }
}

export default router;
