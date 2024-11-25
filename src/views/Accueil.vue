<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-text">
        <h1>Aide Asso - Gérez facilement votre association</h1>
        <p>
          Avec Aide Asso, simplifiez la gestion de votre association : membres, trésorerie, démarches administratives, et bien plus encore.
        </p>
        <Button label="En savoir plus" icon="pi pi-info-circle" class="p-button-lg p-button-primary" />
      </div>
      <div class="hero-image">
        <img src="../assets/images/Partnership-bro.png" alt="Gestion d'association" />
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <h2>Pourquoi choisir Aide Asso ?</h2>
      <div class="features-grid">
        <Card class="feature">
          <template #title>
            <h3>Gestion d'associations</h3>
          </template>
          <template #content>
            <div class="feature-content">
              <img src="../assets/images/Design team-amico.png" alt="Gestion d'associations" class="feature-image" />
              <p>Ajoutez et gérez facilement votre association, y compris son RNA, SIREN, statuts, et règlement.</p>
            </div>
          </template>
        </Card>

        <Card class="feature">
          <template #title>
            <h3>Gestion des membres</h3>
          </template>
          <template #content>
            <div class="feature-content">
              <img src="../assets/images/Team goals-pana.png" alt="Gestion des membres" class="feature-image" />
              <p>Suivez les adhésions et gérez efficacement vos membres avec un tableau de bord simple et intuitif.</p>
            </div>
          </template>
        </Card>

        <Card class="feature">
          <template #title>
            <h3>Trésorerie simplifiée</h3>
          </template>
          <template #content>
            <div class="feature-content">
              <img src="../assets/images/Investment data-bro.png" alt="Trésorerie simplifiée" class="feature-image" />
              <p>Gérez les finances de votre association, avec des rapports détaillés sur les entrées et sorties.</p>
            </div>
          </template>
        </Card>

        <Card class="feature">
          <template #title>
            <h3>Démarches administratives</h3>
          </template>
          <template #content>
            <div class="feature-content">
              <img src="../assets/images/Admin-bro.png" alt="Démarches administratives" class="feature-image" />
              <p>Réalisez facilement vos démarches administratives en ligne, telles que la création d'associations ou la gestion d'AG.</p>
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section id="cta" class="cta">
      <h2>Prêt à simplifier la gestion de votre association ?</h2>
      <router-link to="/signup">
        <Button label="Inscrivez-vous gratuitement" icon="pi pi-user-plus" class="p-button-lg p-button-success" />
      </router-link>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="box">
        <h2>Contactez-nous</h2>
        <form class="contact-form">
          <div class="in">
            <div>
              <label for="name">Nom :</label>
              <input id="name" placeholder="Votre nom" />
            </div>
          </div>
          <div class="in">
            <div>
              <label for="email">Email :</label>
              <input id="email" placeholder="Votre email" />
            </div>
          </div>
          <div class="in">
            <div>
              <label for="message">Message :</label>
              <textarea id="message" rows="4" placeholder="Votre message"></textarea>
            </div>
          </div>
          <div class="button_action">
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';

export default {
  name: 'Home',
  components: {
    Button,
    InputText,
    Card,
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #ebecf0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif; /* Changement de police ici */
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  background-color: #f5f5f5;
}

.hero-text {
  max-width: 500px;
}

.hero-image img {
  max-width: 500px; /* Limite de largeur maximale */
}

.features {
  padding: 50px;
  background-color: #fff;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Responsive design */
  gap: 30px;
}

.feature {
  padding: 20px; /* Espace à l'intérieur de la carte */
}

.feature-content {
  text-align: center; /* Centrer le texte */
}

.feature-image {
  max-width: 100%; /* Ajuste l'image pour qu'elle soit responsive */
  height: auto;
  margin: 1em 0; /* Espacement autour de l'image */
}

.cta {
  text-align: center;
  padding: 50px;
  background-color: #4a90e2;
  color: white;
}

.contact {
  padding: 50px;
  display: flex;
  justify-content: center; /* Centrer le formulaire */
}

.box {
  background-color: #fff;
  display: flex;
  border-radius: 1em;
  width: 30vw;
  flex-direction: column;
  padding: 2em;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.in {
  display: flex;
  flex-direction: column;
  margin: 0.8em 0;
}

.in div {
  display: flex;
  align-items: center;
  width: 100%;
}

.in label {
  margin: 0.2em;
  flex-basis: 30%; /* Laissez plus d'espace pour le texte du label */
}

.in input,
.in textarea {
  width: 100%;
  padding: 1em;
  border: 1px solid #ebecf0;
  border-radius: 0.7em;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 0px 0px 0px, rgba(60, 64, 67, 0.15) 0px 0px 3px 0px;
  margin-left: 0.5em; /* Ajout d'un espace entre le label et le champ */
}

.button_action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: 0.5em 0;
}

.button_action button {
  border: 0;
  padding: 0.4em 0.8em;
  color: #fff;
  background-color: #0587f0;
  border: 1px solid #ebecf0;
  cursor: pointer;
  transition: 250ms;
  border-radius: 1em;
}

.button_action button:hover {
  background-color: #f5f5f5;
  color: #0587f0;
}

footer {
  text-align: center;
  padding: 20px;
  background-color: #4a90e2;
  color: white;
}
</style>
