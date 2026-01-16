# Art Portfolio Platform

> Una plataforma web per a artistes que volen mostrar els seus portfolis, àlbums i obres. Inclou funcionalitats tant públiques com protegides per usuari autenticat.

---

## Descripció del projecte

Aquest projecte permet a usuaris crear i gestionar portfolis d’artistes, àlbums i obres. També ofereix una secció pública per visualitzar obres, amb filtres per categories i tags.  
L’usuari pot registrar-se, login, recuperar contrasenya i gestionar el seu perfil.Aquest projecte s’ha desenvolupat com a part d’un treball acadèmic, amb l’objectiu d’aplicar de manera pràctica els coneixements adquirits.


### Funcionalitats principals

- **Autenticació i usuaris**
  - Registre, login, logout
  - Recuperació i reset de contrasenya
  - Protecció de rutes amb `ProtectedRoute`
- **Gestió de portfolis**
  - Crear, editar i eliminar portfolis
  - Associar àlbums i obres a cada portfoli
- **Gestió d’àlbums**
  - Crear, editar i eliminar àlbums dins un portfoli
- **Gestió d’obres**
  - Afegir, editar i eliminar obres dins un àlbum
  - Visualització d’obres amb imatge, descripció i informació d’àlbum
- **Secció pública**
  - Visualització d’obres sense autenticació
  - Filtres per categories i tags
- **Dashboard**
  - Visualització ràpida dels portfolis propis
  - Accessos directes a crear portfoli, àlbum o obra

---
## Server (Backend)
---
### Esquema de Base de Dades

El projecte utilitza una base de dades relacional.  

### Taules principals

### 1. Taula `users`
Conté la informació dels usuaris registrats al sistema.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `name` | VARCHAR | Nom de l'usuari |
| `email` | VARCHAR | Correu electrònic únic de l'usuari |
| `email_verified_at` | TIMESTAMP | Data de verificació del correu |
| `password` | VARCHAR | Contrasenya encriptada |
| `rol` | VARCHAR | Rol de l'usuari (per defecte: 'user') |
| `imatge` | VARCHAR | URL de la imatge de perfil (opcional) |
| `active` | BOOLEAN | Estat actiu/inactiu de l'usuari (per defecte: true) |
| `remember_token` | VARCHAR | Token de recordatori de sessió |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 2. Taula `portfolis`
Conté els portfolis dels usuaris que contenen les seves obres.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `usuari_id` | INT | Identificador de l'usuari propietari (clau forana) |
| `titol` | VARCHAR | Títol del portfoli |
| `descripcio` | TEXT | Descripció del portfoli |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 3. Taula `albums`
Conté els àlbums dins dels portfolis, agrupant obres per temàtica.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `portfoli_id` | INT | Identificador del portafolium (clau forana) |
| `nom` | VARCHAR | Nom de l'àlbum |
| `descripcio` | TEXT | Descripció de l'àlbum (opcional) |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 4. Taula `categories`
Conté les categories per clasificar les obres.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `nom` | VARCHAR | Nom únic de la categoria |
| `descripcio` | TEXT | Descripció de la categoria (opcional) |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 5. Taula `obres`
Conté les obres artístiques del projecte.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `categoria_id` | INT | Identificador de la categoria (clau forana) |
| `album_id` | INT | Identificador de l'àlbum (clau forana) |
| `titol` | VARCHAR | Títol de l'obra |
| `descripcio` | TEXT | Descripció detallada de l'obra |
| `data` | DATE | Data de creació de l'obra |
| `fitxer_url` | VARCHAR | URL o ruta del fitxer de l'obra |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 6. Taula `tags`
Conté les etiquetes per marcar les obres.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `nom` | VARCHAR | Nom únic de l'etiqueta |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 7. Taula `obra_tag` (Taula de Relació)
Relació many-to-many entre obres i etiquetes.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `obra_id` | INT | Identificador de l'obra (clau forana) |
| `tag_id` | INT | Identificador de l'etiqueta (clau forana) |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

---

### 8. Taula `visualitzacions`
Conté el registre de visualitzacions de les obres pels usuaris.

| Camp | Tipus | Descripció |
|------|-------|-----------|
| `id` | INT | Identificador únic (clau primària) |
| `usuari_id` | INT | Identificador de l'usuari (clau forana) |
| `obra_id` | INT | Identificador de l'obra (clau forana) |
| `data_visualitzacio` | TIMESTAMP | Data i hora de la visualització |
| `created_at` | TIMESTAMP | Data de creació |
| `updated_at` | TIMESTAMP | Data de la darrera actualització |

> [Diagrama de base de dades](https://drive.google.com/file/d/189P4ORvR6WMAHa5BlEsa3gmWtaYsIVcd/view?usp=sharing) 


---

## Relacions Entre Taules

- **users <-> portfolis**: Un usuari pot tenir múltiples portfolis (relació 1:N)
- **portfolis <-> albums**: Un portfolium pot tenir múltiples àlbums (relació 1:N)
- **albums <-> obres**: Un àlbum pot contenir múltiples obres (relació 1:N)
- **categories <-> obres**: Una categoria pot tenir múltiples obres (relació 1:N)
- **obres <-> tags**: Una obra pot tenir múltiples etiquetes (relació N:N)
- **users <-> visualitzacions <-> obres**: Un usuari pot visualitzar múltiples obres, i cada obra pot ser visualitzada per múltiples usuaris (relació N:N)

---

## Estructura MVC del Backend

---

### Models
Els models representen les entitats de la base de dades i encapsulen la lògica per interactuar amb les dades. Cada model correspon a una taula de la base de dades i defineix les seves relacions amb altres models. Els models principals del projecte són:

- **User**: Representa els usuaris del sistema amb els seus atributs (name, email, password, rol, imatge, etc.)
- **Portfoli**: Representa els portfolis dels usuaris, contenidor principal de les obres artístiques
- **Album**: Agrupa les obres dins d'un portfoli per temàtica
- **Obra**: Representa les obres artístiques amb tota la informació (títol, descripció, data, fitxer, etc.)
- **Categoria**: Classifica les obres per tipus
- **Tag**: Etiquetes per marcar les obres amb paraules clau
- **Visualitzacio**: Registra quan un usuari visualitza una obra

Aquests models relacionen les dades entre si de manera eficient, facilitant operacions CRUD (Create, Read, Update, Delete). L’ús de models facilita el manteniment del codi i permet centralitzar la lògica relacionada amb cada entitat.

## Controladors

Els controladors gestionen la lògica de negoci i l'interacció entre els models i les rutes. La separació dels controladors ajuda a mantenir una estructura clara i fàcilment ampliable. Els controladors principals són:

### Controladors de l'API (`app/Http/Controllers/Api/`)

- **AuthController**: Gestiona autenticació, registre, login i reset de contrasenya
- **UserController**: Gestiona perfils d'usuari, obtenir usuaris públics
- **ObraController**: CRUD complet d'obres artístiques
- **PortfoliController**: Gestió de portfolis dels usuaris
- **AlbumController**: Gestió d'àlbums dins dels portfolis
- **CategoriaController**: Gestió de categories d'obres
- **TagController**: Gestió d'etiquetes per marcar obres
- **VisualitzacioController**: Registre de visualitzacions d'obres
- **AdminController**: Funcions administratives (gestió d'usuaris)

### Controladors Admin (`app/Http/Controllers/Admin/`)

- **DashboardController**: Panell de control administratiu
- **UserController**: Gestió d'usuaris des del panell admin
- **CategoryController**: Gestió de categories des del panell admin
- **TagController**: Gestió d'etiquetes des del panell admin

---

## Vistes
Les vistes són templates Blade (sistema de plantilles de Laravel) responsables de la presentació de les dades al navegador. En aquest projecte, les vistes es troben en `resources/views/` i s'utilitzen principalment per a:

- **Panell Administratiu**: Presentació de la interfície d'administració amb Blade templates.
- **Emails**: Templates per a notificacions per correu electrònic (com a reset de contrasenya).

La major part de la interfície d'usuari es gestiona a través del frontend React, que comunica amb el backend mitjançant l'API REST, separant així la lògica. Aquesta separació entre frontend i backend permet treballar de manera més modular i desacoblada.

---

## Middleware

Els middleware són components que filtren les sol·licituds HTTP abans que arribin als controladors. El projecte utilitza els següents middleware personalitzats:

### RoleMiddleware
- **Ubicació**: `app/Http/Middleware/RoleMiddleware.php`
- **Funcionalitat**: Valida que l'usuari autenticat tingui el rol requerit per accedir a una ruta.
- **Ús**: S'aplica automàticament a les rutes que requereixen un rol específic (p. ex., `role:admin`).
- **Resposta en cas de falla**: Retorna un error 403 Unauthorized amb missatge d'error JSON.

### EnsureEmailIsVerified
- **Ubicació**: `app/Http/Middleware/EnsureEmailIsVerified.php`
- **Funcionalitat**: Assegura que l'usuari ha verificat el seu correu electrònic.
- **Ús**: S'aplica a les rutes que requereixen email verificat.

### Middleware de Laravel (Inclosos)
- **auth:sanctum**: Verifica que l'usuari està autenticat mitjançant Sanctum.
- **verified**: Comprova que l'email és verificat.

---

## Part del client (Frontend)

El client és la interfície d'usuari de l'aplicació, que permet als usuaris interactuar amb el sistema. Inclou components d'interacció i visualització de dades, així com la gestió de l'estat de l'aplicació. Aquests criteris s’han tingut en compte durant el desenvolupament del projecte, assegurant que l'experiència de l'usuari sigui consistent a través de diferents dispositius i mides de pantalla. A més, la web ha de ser accessible, garantint que tots els usuaris, incloent aquells amb discapacitats, puguin utilitzar l'aplicació sense dificultats.

---

## Estructura del Frontend

El projecte segueix una estructura organitzada i modular que facilita la mantenibilitat i l'escalabilitat:


## Descripció de Components Principais

### Pàgines (Pages)
Les pàgines són components que representen les vistes completes de la navegació. Cada pàgina correspon a una ruta i és responsable de:

- **Home**: Mostra la pàgina principal amb seccions de hero, artistes, valors i obres destacades
- **LoginPage**: Formulari de login amb validació
- **RegisterPage**: Formulari de registre de nous usuaris
- **Dashboard**: Panell de control personalitzat per a usuaris autenticats
- **ArtistesPage**: Llistat de tots els artistes registrats
- **PortfoliPage**: Visualització del portfoli d'un usuari específic
- **ObraPage**: Detalls complets d'una obra individual
- **PublicObresPage**: Llistat public de totes les obres amb paginació i filtres
- **Creació/Edició**: Pàgines per crear i editar portfolis, àlbums i obres

### Components Reutilitzables
Els components són peces de la interfície reutilitzables que encapsulen lògica i presentació:

- **Navbar**: Barra de navegació responsiva amb menú mòbil
- **ProtectedRoute**: Component que protegeix les rutes que requereixen autenticació
- **Modal**: Component modal reutilitzable per a diàlegs i confirmacions
- **ObresGrid/ObresList**: Components per visualitzar obres en grid o llistat
- **Paginacio**: Component de paginació per a llistats llargs
- **NotificationToast**: Sistema de notificacions flotants
- **ErrorBoundary**: Captura errors de React per evitar crashes

### Contextos (Context API)
Els contextos gestionen l'estat global de l'aplicació:

- **AuthContext**: Gestiona autenticació, usuari actual, tokens i mètodes de login/logout
- **NotificationContext**: Gestiona les notificacions que es mostren a l'usuari

### Serveis (Services)
Els serveis encapsulen la comunicació HTTP amb el backend:

- **api.js**: Configuració d'Axios amb interceptadors, setejant headers d'autenticació automàticament

---

## Flux de Dades i Autenticació

1. **Login/Autenticació**: 
   - L'usuari entra les credencials a `LoginPage`
   - `AuthContext` realitza la petició a l'API (`/login`)
   - Es rep un token JWT que s'emmagatzema en `localStorage`
   - Axios automàticament inclou el token en totes les peticions

2. **Comunicació amb Backend**:
   - Els components utilitzen `AuthContext` i funcions del `api.js`
   - Axios realitza peticions HTTP al backend
   - Les respostes es gestionen amb `NotificationContext` per mostrar missatges

3. **Gestió d'Errors**:
   - `ErrorBoundary` captura errors de renderització
   - `ProtectedRoute` redirigeix a login si no hi ha autenticació
   - Validació de formularis en el client abans d'enviar

Aquest flux permet una experiència d’usuari fluida tot mantenint la seguretat de les dades.

---

## Multiidioma (i18n)

L'aplicació suporta múltiples idiomes:

- Configuració en `i18n.js` amb i18next
- Fitxers de traducció per a cada idioma
- Component `useTranslation()` de react-i18next per accedir a les traduccions
- Selector d'idioma disponible a la Navbar


## Com instal·lar-ho i provar-ho

### 1. Clonar el Repositori  
Utilitzar la següent comanda per clonar el repositori a la vostra màquina local:
```bash
git clone https://github.com/usuari/nombre-del-repositori.git
cd nombre-del-repositori
```

---

### 2. Instal·lar Dependències  
Assegurar-vos que teniu instal·lat [Node.js](https://nodejs.org/) i [Composer](https://getcomposer.org/). A continuació, executeu les següents comandes per instal·lar les dependències del projecte:
```bash
# Instal·lar dependències del backend terminal wsl
cd back-end
composer install

# Instal·lar dependències del frontend
cd ../front-end
npm install
```

---

### 3. Configurar Variables d'Entorn  
Crear un fitxer `.env` a la carpeta `back-end`. Configurar les variables d'entorn necessàries, com ara la connexió a la base de dades:
```bash
cp .env.example .env
```
Editar el fitxer `.env` i configurar les següents variables:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nomDB
DB_USERNAME=username
DB_PASSWORD=password

APP_URL=http://localhost:8085
#El port d’APP_URL ha de coincidir amb el port que utilitzarem més endavant.
```
generar la `key`

```bash
php artisan key:generate
```
Això omplirà automàticament la variable APP_KEY al teu .env amb una clau segura.Sense aquesta clau, Laravel no podrà encriptar sessions ni dades correctament i t’apareixerà un error com “No application encryption key has been specified.”

---

### Pas 4:Migrar la bd
```bash
sail artisan migrate
```
Executar el seeder
```bash
sail artisan db:seed
```
Això omplirà la base de dades amb dades de prova.

---

### Pas 5: Obrir Terminal 2 - Frontend React
```bash
cd front-end
npm run dev
```
Hauria de veure:
```
VITE v7.x.x ready in xxxxx ms
➜  Local:   http://localhost:5173/
```
Ja funciona la part del react 

---

### Pas 6: Obrir Terminal WSL - Backend
```bash
cd back-end
php artisan serve
```
S'hauria de veure:
```
INFO  Server running on [http://127.0.0.1:8000]
```
Ja es pot accedir a les vistes blade

