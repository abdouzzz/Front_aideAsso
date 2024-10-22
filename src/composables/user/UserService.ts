import { useUserApi } from './UserAPI';

const userApi = useUserApi();

export function useUserService() {
  return {
    async getUserById(id: number) {
      try {
        const response = await userApi.getUserById(id);
        if (response) {
          return response;  // Retourne les données utilisateur si l'appel est réussi
        } else {
          return 'Utilisateur non trouvé.';  // Gestion d'erreur : aucune donnée renvoyée
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return 'Erreur lors de la récupération des données utilisateur.';
      }
    },

    async loginUser(email: string, password: string) {
      try {
        const response = await userApi.loginUser(email, password);
        if (response) {
          sessionStorage.setItem('jwt', response.token);  // Suppose que `token` est renvoyé par l'API
          return false;  // Renvoie `false` si la connexion a réussi
        } else {
          return 'Erreur lors de la connexion. Identifiants incorrects.';
        }
      } catch (error) {
        console.error('Erreur lors de la tentative de connexion :', error);
        return 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
      }
    },

    async createUserAccount(
      firstName: string, 
      lastName: string, 
      email: string, 
      password: string, 
      confirmPassword: string
    ) {
      try {
        const response = await userApi.createUserAccount(firstName, lastName, email, password, confirmPassword);
        if (response) {
          sessionStorage.setItem('jwt', response.token);  // Stocke le token JWT (supposé renvoyé par l'API)
          return false;  // Retourne `false` pour indiquer que la création de compte a réussi
        } else {
          return 'Échec de la création du compte. Vérifiez les informations saisies.';
        }
      } catch (error) {
        console.error('Erreur lors de la création du compte utilisateur :', error);
        return 'Une erreur est survenue lors de la création du compte. Veuillez réessayer plus tard.';
      }
    }
  };
}
