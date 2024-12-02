export default interface Association {
  id: number;
  nom: string; // Nom de l'association
  role: string; // Numéro RNA de l'association
  association_id: number; // Numéro SIREN de l'association
  username: string; // URL de la page web de l'association
  prenom: string; // Description de l'association
  email: string; // Email de l'association
  date_naissance: Date; // Numéro de téléphone de l'association
  date_adhesion: Date;
  user_id: number;
}
