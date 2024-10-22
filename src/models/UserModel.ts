export default interface User {
  id?: number; // Champ optionnel car il est auto-incrémenté
  username: string; // Nom d'utilisateur unique
  email: string; // Email unique
  nom: string; // Nom
  prenom: string; // Prénom
  date_naissance?: Date; // Date de naissance, optionnelle
  photo?: Blob; // Photo sous forme de BLOB, optionnelle
  password_hash: string; // Mot de passe hashé
  created_at?: Date; // Date de création, optionnelle
  updated_at?: Date; // Date de dernière mise à jour, optionnelle
}
