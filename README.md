# Eco-Travel-App



## Cerințe preliminare

Înainte de a rula aplicația, asigură-te că ai instalate următoarele software-uri:

- [Node.js](https://nodejs.org) (versiune >= 16.18.1)
- [React Native](https://reactnative.dev) (versiune >= 9.2.1)
- [Expo](https://expo.dev) (versiune >= 6.0.8)
- [Yarn](https://yarnpkg.com) (versiune >= 1.22.19)

Pentru a vizualiza aplicația în timp real pe un dispozitiv mobil, asigură-te că ai instalată aplicația Expo Go pe dispozitivul tău. Poți găsi aplicația Expo Go în următoarele locuri:

- [Expo Go pe App Store](https://apps.apple.com/us/app/expo-go/id982107779)
- [Expo Go pe Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)

## Configurarea Firebase

### Crearea unui cont Firebase

1. Accesează [https://firebase.google.com](https://firebase.google.com) și creează un cont nou sau autentifică-te cu contul tău existent.

2. Dacă este necesar, creează un proiect nou.

### Obținerea cheii API Firebase

1. Accesează [Consola Firebase](https://console.firebase.google.com) și selectează proiectul creat anterior.

2. Navighează la secțiunea "Setări proiect" sau "Settings" în meniul proiectului.

3. Selectează fila "General" sau "General" tab.

4. Derulează în jos până la secțiunea "Cheie API Firebase" sau "Firebase API key" și copiază cheia afișată.

### Configurarea proiectului cu cheia API Firebase

1. Navighează în directorul proiectului și deschide fișierul `firebase.js`.

2. Adaugă cheia API Firebase și restul configurărilor necesare în vairiabila `firebaseConfig`.

## Configurarea Google

### Obținerea cheii Google API

Pentru a utiliza serviciile Google, cum ar fi Directions API sau Places API, este necesar să obții o cheie de API de la Google. Iată pașii pentru a obține Google API Key:

1. Accesează Consola de Dezvoltator Google

Accesează [Consola de Dezvoltator Google](https://console.developers.google.com/) și autentifică-te cu contul tău Google.

2. Creați un proiect nou

Dacă nu ai deja un proiect, crează unul nou selectând opțiunea "Create Project". Dacă ai deja un proiect, selectează-l din lista proiectelor disponibile.

3. Activează serviciile necesare

Pentru a utiliza serviciile Google, trebuie să activezi serviciile relevante în cadrul proiectului tău. De exemplu, pentru a utiliza Directions API și Places API, trebuie să activezi aceste două servicii.

- Navighează la "Dashboard" (Panou de control) în Consola de Dezvoltator Google.
- Apasă pe butonul "Enable APIs and Services" (Activează API-uri și Servicii).
- Caută și selectează serviciul dorit, cum ar fi "Directions API" sau "Places API".
- Apasă pe butonul "Enable" (Activează) pentru a activa serviciul.

4. Creează o cheie de API

- Din meniul lateral, selectează "Credentials" (Credențiale).
- Apasă pe butonul "Create Credentials" (Creează Credențiale) și selectează "API Key" (Cheie de API).
- Va fi generată o cheie de API nouă. Copiază această cheie, deoarece o vei folosi pentru a accesa serviciile Google.

### Configurarea proiectului cu cheia API Google

1. Navighează în directorul proiectului și deschide fișierul `.env`.

2. Adaugă cheia API Google în fișierul `.env` folosind următoarea sintaxă:
   `GOOGLE_API_KEY = google_api_key`

## Obținerea cheilor Stripe API

Pentru a utiliza serviciile Stripe, cum ar fi plățile online, este necesar să obții cheile de API (Public Key și Secret Key) de la Stripe. Iată pașii pentru a obține aceste chei:

1. Creați un cont Stripe

Accesați site-ul [Stripe](https://stripe.com) și creați un cont nou. Completați toate informațiile necesare și finalizați procesul de înregistrare.

2. Accesați Dashboard-ul Stripe

După autentificare, veți fi redirecționat către dashboard-ul principal al contului Stripe.

.: Accesați secțiunea "Developers" (Dezvoltatori)

În partea de sus a dashboard-ului, veți găsi un meniu. Faceți clic pe opțiunea "Developers" (Dezvoltatori) pentru a accesa setările și instrumentele pentru dezvoltatori.

4. Accesați opțiunea "API Keys" (Chei API)

În meniul lateral al secțiunii "Developers", faceți clic pe opțiunea "API Keys" (Chei API) pentru a accesa setările cheilor API.

5. Obțineți cheile API

În secțiunea "API Keys" (Chei API), veți găsi două tipuri de chei: cheia publică (Public Key) și cheia secretă (Secret Key).

- Public Key (stripe_pk): Aceasta este cheia de API publică și este utilizată pentru comunicarea cu API-ul Stripe din partea clientului. Copiați această cheie și păstrați-o în siguranță.

- Secret Key (stripe_sk): Aceasta este cheia de API secretă și este utilizată pentru comunicarea cu API-ul Stripe din partea serverului. Această cheie trebuie păstrată într-un mediu sigur și nu trebuie dezvăluită în aplicația clientului sau în codul sursă public.

### Configurarea proiectului cu cheile API Stripe

1. Navighează în directorul proiectului la adresa `Eco-Travel-App/src/components/StripeCard` și deschide fișierul `Card.js`.

2. Adaugă cheia API Publică Stripe în variabila `STRIPE_PK`

3. Navighează în directorul proiectului la adresa `Eco-Travel-App/src/components/StripeCard/server` și deschide fișierul `server.js`.

4. Adaugă cheia API Secretă Stripe în variabila `STRIPE_SK` 

## Cum să începi

Urmează pașii de mai jos pentru a porni aplicația:

1. Clonează repository-ul:

   ```shell
   git clone https://github.com/DanielPantea/Eco-Travel-App.git
   
2. Navighează în directorul proiectului:

   ```shell
   cd Eco-Travel-App

3. Instalează dependințele proiectului folosind Yarn:

   ```shell
   yarn install

4. Porniți aplicația folosind comanda:

   ```shell
   yarn start
   ```
   Aceasta va porni serverul Expo și va compila aplicația. Veți vedea un cod QR în terminal și în browser.

5. Navighează în directorul serverului stripe.
   
   ```shell
   cd src/components/StripeCard/server

6. Porniți serverul express folosind comanda:

   ```shell
   yarn start
   ```
   Astfel veți putea utiliza serviciile de plăți.
   
7. Pe dispozitivul mobil, deschide aplicația Expo Go și scanează codul QR afișat în terminal sau în browser. Astfel vei putea vizualiza aplicația în timp real pe dispozitivul mobil.
