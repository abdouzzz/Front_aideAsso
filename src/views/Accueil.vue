<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero hero_mobile">
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

    <!-- Search Association Section -->
    <section class="features">
      <h2>Vous souhaitez rechercher les associations de votre département ?</h2>
      <Dropdown @change="selection(depSelect)" v-model="depSelect" :options="listeDep" filter optionLabel="nom" placeholder="Selectionnez un département" class="w-full md:w-18rem">
            <template #value="slotProps">
                <div v-if="slotProps.value != 0" class="flex align-items-center">
                    <div>{{ slotProps.value.nom }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div>{{slotProps.option.code}} - {{ slotProps.option.nom }}</div>
                </div>
            </template>
        </Dropdown>
        <div id="map">

        </div>
    </section>
    <!-- Call to Action Section -->
    <section id="cta2" class="cta">
      <h2>Retrouvez AideAsso sur votre smartphone</h2>
      <a href="/app-release.apk">
        <Button label="Télécharger l'application AideAsso" icon="pi pi-download" class="p-button-lg p-button-success" />
      </a>
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

<script setup>

import { onMounted, ref } from 'vue'
import * as Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import { Association } from '@/models/AssociationModel';
import { useAssoService } from '@/composables/asso/AssoService';
const AssoService = useAssoService();


    // Canevas leaflet pour la carte
    let tileLayer = Leaflet.tileLayer
    // Initialisation de la carte sous forme de ref
    let map = ref()
    // Liste des départements   
    let listeDep = ref()

    // Département sélectionné
    let depSelect = ref()

    // Liste des gares d'un département
    let listeAsso = ref()
                let markers = Leaflet.featureGroup();
let myIcon = Leaflet.icon({iconUrl: 'images/marker-icon.png', 
                shadowUrl: 'images/marker-shadow.png', iconSize: [25,41], shadowSize: [25,41],
                iconAnchor: [0,0], shadowAnchor:[-10, -10], popupAnchor:[0,0]});
onMounted( async () => {
        // Caractéristiques visuelles de la carte
        tileLayer = Leaflet.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        );

        // Création de la carte sur la div ayant : id='map'
        map = Leaflet.map('map',
        {
            zoomControl:true,        // Contrôle du zoom
            layers: [tileLayer],    // Canvas pour dessiner la carte
            maxZoom:18,             // Zoom maxi autorisé
            minZoom:6               // Zoom mini autorisé
        })
        // Projection de la carte avec centrage aux coordonées indiquées, avec facteur d'agrandissement
        .setView([47.495328, 6.8044455], 17)

        // Recherche des départements - geo api gouv
        await fetch ('https://geo.api.gouv.fr/departements')
        // Réponse demandée en json
        .then(response => response.json())
        // Récupération del a réponse
        .then(response => {
            listeDep.value = response;
            // On vérifie dans la console l'obtention des résultats
            console.log("response", listeDep)
            // Valeur 0 par défaut : Sélectionner un département
            depSelect.value="0"
        })
        .catch(error => console.log('ereur Ajax'))

    })

    const selection = async (dep) => {
            console.log("département selectionné", dep)
        // Recherche des départements - api gouv
        const response = await AssoService.getAssociationsByCp(dep.code)
        // Récupération de la réponse
        // .then(response => {
            // Récupération de la liste des gares
            console.log(response);
            listeAsso.value = response;
            // On vérifie dans la console l'obtention des résultats
            console.log("Liste des gares", listeAsso);
            // Instanciation des markers
            // Calque FeatureGroup - groupe de calques (markers)
            // Création d'un icone, le même pour tous
            
            // Parcours des associations
            // listeAsso.value.forEach( (gare) =>{
            //     // Récupération des coordonées de la gare
            //     let position = gare.geometry.coordinates;
            //     // Nom de la commune
            //     let libelle = gare.fields.commune;
            //     // Ajout d'un marqueur
            //     // Attention latitude / longitude inversées dans les données
            //     let marker = Leaflet.marker([position[1], position[0]], {icon: myIcon});
            //     // Ajout d'une infobulle
            //     marker.bindPopup(libelle);
            //     // Ajout au tableau de markers
            //     markers.addLayer(marker);
            // })
            const markerPromises = listeAsso.value.map(async(association) => {
              if (association) {
                await addMarker(association.adresse + " " + association.code_postal + " " + association.ville, association.nom);
              }
            })
                await Promise.all(markerPromises);

            // Ajout des markers à la carte
            map.addLayer(markers);
            // Positionnement sur l'ensemble des markers
            // la fonction fitbounds permet de repositionner sur la carte
            // sur le centre de l'ensemble de latitude/longitude
            // la fonction getBounds permet de donner les deux points extrêmes
            // (rectangle) de l'ensemble des marqueurs
            console.log(markers)
           map.fitBounds(markers.getBounds());
        // })
        // .catch(error => console.log('erreur Ajax', error))

        }
const addMarker = async (address, name) => {
      try {
        // Appel à un service de géocodage (Nominatim ici)
        const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`);
        const geocodeData = await geocodeResponse.json()
        if (geocodeData.length > 0) {
          console.log(geocodeData);
          const location = geocodeData[0];
      console.log("Géocodage réussi :", location, location.lat, location.lon); // Debug
            let marker = Leaflet.marker([location.lat, location.lon], {icon: myIcon});
          marker.bindPopup(`<b>${name}</b><br>${address}`);
          markers.addLayer(marker);
        } else {
          console.warn(`Adresse introuvable : ${address}`);
        }
      } catch (error) {
        console.error(`Erreur lors du géocodage de l'adresse "${address}":`, error);
      }
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
    #map{
        width:100%;
        height:70vh;
    }

    @media (max-width:640px){
  .hero_mobile{
    flex-direction: column;
  }
  .hero-image img{
    width:100%;
  }
  .feature{
    padding:5px;
  }
  .box{
    width:70vw;
  }
}
</style>
