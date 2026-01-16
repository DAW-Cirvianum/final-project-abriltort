import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "ca", // idioma per defecte
  fallbackLng: "en", // si falta una traducció

  interpolation: {
    escapeValue: false, // React ja protegeix
  },

  resources: {
    ca: {
      translation: {
        hero: {
          title: "Descobreix el món de l’artista",
          subtitle: "Explora les visions de cada artista",
          button: "Explora ara",
          imageAlt: "Art destacat",
        },
        nav: {
          artists: "Autors",
          works: "Obres",
          myPortfolio: "El meu portfoli",
          editProfile: "Editar perfil",
          login: "Inicia sessió",
          register: "Registra't",
          logout: "Tanca sessió",
          hello: "Hola, {{name}}",
          avatarAlt: "Avatar d'usuari",
        },
        common: {
          edit: "Editar",
          delete: "Eliminar",
          deleting: "Eliminant...",
          cancel: "Cancel·lar",
          saving: "Guardant...",
          back: "Tornar",
          updating: "Actualitzant...",
          confirm: "Confirmar",
        },
        obres: {
          deleteSuccess: "Obra eliminada correctament!",
          deleteError: "No s'ha pogut eliminar l'obra.",
          confirmDeleteTitle: "Confirmació d'eliminació",
          confirmDeleteMessage: "Segur que vols eliminar aquesta obra?",
        },
        album: {
          fields: {
            name: "Nom de l'àlbum",
            description: "Descripció",
          },
          placeholders: {
            name: "Escriu el nom de l'àlbum",
            description: "Escriu una descripció opcional",
          },
          buttons: {
            create: "Crear àlbum",
            update: "Actualitzar àlbum",
          },
          notifications: {
            createSuccess: "Àlbum creat correctament!",
            updateSuccess: "Àlbum actualitzat correctament!",
            deleteSuccess: "Àlbum eliminat correctament!",
          },
          errors: {
            requiredName: "El camp nom és obligatori.",
            formError: "Hi ha errors al formulari.",
            saveError: "No s'ha pogut guardar l'àlbum.",
            loadObres: "No s'han pogut carregar les obres.",
            albumWithObres: "No pots eliminar un àlbum que conté obres.",
            deleteError: "No s'ha pogut eliminar l'àlbum.",
          },
          loadingObres: "Carregant obres...",
          modal: {
            confirmDeleteTitle: "Confirmació d'eliminació",
            confirmDeleteMessage: "Segur que vols eliminar aquest àlbum?",
          },
        },
        artistes: {
          title: "Explora els nostres artistes",
          description:
            "Descobreix els últims talents que s’han unit a la nostra comunitat. Cada artista aporta la seva visió única i creativitat.",
        },
        editarPerfil: {
          title: "Editar Perfil",
          fields: {
            name: "Nom",
            email: "Email",
            password: "Contrasenya (deixar buit si no vols canviar)",
            image: "Imatge de perfil",
          },
          placeholders: {
            password: "••••••••",
          },
          buttons: {
            saveChanges: "Guardar canvis",
          },
          notifications: {
            updateSuccess: "Perfil actualitzat correctament",
          },
          errors: {
            loadProfile: "No s'han pogut carregar les dades de l'usuari",
            generic: "Hi ha hagut un error, torna-ho a provar",
          },
        },
        errorBoundary: {
          fallback: "Alguna cosa ha fallat",
        },

        footer: {
          description:
            "Connecta amb artistes i descobreix les seves obres. La teva passió per l'art, aquí.",
          links: {
            title: "Enllaços",
            home: "Inici",
            login: "Login",
            register: "Registrar-se",
          },
          contact: {
            title: "Contacte",
            email: "Email: info@B612.art",
            phone: "Telèfon: +34 123 123 123",
          },
          bottom: "Tots els drets reservats.",
        },
        obraForm: {
          addTitle: "Afegir Obra",
          editTitle: "Editar Obra",
          labels: {
            title: "Títol",
            description: "Descripció",
            album: "Àlbum",
            category: "Categoria",
            tags: "Tags",
            file: "Fitxer",
          },
          placeholders: {
            selectAlbum: "-- Selecciona un àlbum --",
            noAlbums: "No hi ha àlbums disponibles",
            selectCategory: "-- Selecciona una categoria --",
            noCategories: "No hi ha categories disponibles",
            addTag: "-- Afegir tag --",
          },
          errors: {
            titleRequired: "El títol és obligatori.",
            albumRequired: "Selecciona un àlbum.",
            categoryRequired: "Selecciona una categoria.",
            tagsRequired: "Afegeix almenys un tag.",
            fileRequired: "El fitxer és obligatori.",
            loadTags: "Error carregant tags",
            saveFailed: "No s'ha pogut guardar l'obra.",
          },
          success: {
            created: "Obra creada correctament!",
            updated: "Obra actualitzada correctament!",
          },
          buttons: {
            add: "Afegir Obra",
            update: "Actualitzar Obra",
            saving: "Guardant...",
          },
        },
        obresFilters: {
          allCategories: "Totes les categories",
          allTags: "Tots els tags",
        },
        obresSection: {
          title: "Obres",
          subtitle:
            "Explora les galàxies úniques i les constel·lacions de cada artista",
          viewAll: "Veure totes",
        },
        pagination: {
          prev: "Anterior",
          next: "Següent",
          page: "Pàgina",
          of: "de",
        },
        portfolio: {
          createAlbum: "Crear àlbum",
          createObra: "Crear obra",
          editPortfolio: "Editar portfoli",
          createAlbumFirst: "Crea primer un àlbum",
          title: "Títol",
          description: "Descripció",
          create: "Crear",
          update: "Actualitzar",
          saving: "Guardant...",
          created: "Portfoli creat correctament!",
          updated: "Portfoli actualitzat correctament!",
          titleRequired: "El camp títol és obligatori.",
          errorTryAgain: "Hi ha hagut un problema. Torna-ho a provar.",
        },
        valor: {
          exploreArt: "Explora l’art com mai abans",
          description:
            "Descobreix artistes emergents i les seves obres més fascinants. Connecta amb la creativitat i la inspiració a cada pas.",
          exclusive: {
            title: "Exclusiu",
            text: "Accedeix a obres úniques i creadors que no trobaràs enlloc més.",
          },
          community: {
            title: "Comunitat",
            text: "Uneix-te a altres amants de l’art i comparteix la teva passió.",
          },
          inspiration: {
            title: "Inspiració",
            text: "Descobreix nous estils i idees a cada visita.",
          },
        },
        artistesPage: {
          title: "Explora els nostres artistes",
          loading: "Carregant artistes...",
          noArtistes: "No hi ha artistes disponibles.",
          loadError: "No s'han pogut carregar els artistes.",
          defaultName: "Artista",
        },
        crearAlbumPage: {
          loading: "Carregant...",
          noPortfoli: "Necessites un portfoli abans de crear un àlbum",
          backButton: "Tornar al dashboard",
          title: "Crear nou àlbum",
        },
        crearObraPage: {
          loading: "Carregant formulari...",
          loadError: "No s'ha pogut carregar dades.",
          createTitle: "Crear nova obra",
          editTitle: "Editar obra",
        },

        crearPortfoliPage: {
          title: "Crear el teu portfoli",
        },
        portfoliPage: {
          noArtistId: "No s’ha pogut determinar l’artista.",
          noPortfolioOwner:
            "Encara no tens cap portfoli creat. Crea el teu primer portfoli!",
          noPortfolioUser: "Aquest usuari encara no té portfoli.",
          loadError: "No s’ha pogut carregar el portfoli.",
          loading: "Carregant portfoli...",
          loadingObres: "Carregant obres...",
          hello: "Hola {{name}}!",
          noPortfolioMessage:
            "És el moment perfecte per mostrar el teu talent!",
          createFirstPortfolio: "Crear el teu primer portfoli",
          defaultName: "artista",
        },
        editAlbum: {
          title: "Editar àlbum",
          loading: "Carregant àlbum...",
          noPermission: "No tens permisos per editar aquest àlbum",
        },
        editObra: {
          title: "Editar Obra",
          loading: "Carregant formulari...",
          loadError:
            "No s'ha pogut carregar l'obra, els àlbums o les categories.",
        },
        editarPortfoli: {
          title: "Editar Portfoli",
          loading: "Carregant...",
          loadError: "No s'ha pogut carregar el portfoli.",
          notFound: "No s'ha trobat el portfoli.",
        },
        forgotPassword: {
          title: "Recupera la contrasenya",
          emailLabel: "Email *",
          emailRequired: "L’email és obligatori",
          invalidEmail: "El format de l’email no és vàlid",
          emailInvalid: "L’email no és vàlid",
          serverError: "No s'ha pogut connectar amb el servidor",
          sending: "Enviant...",
          sendButton: "Envia correu",
        },
        login: {
          title: "Inicia sessió",
          loginInputLabel: "Nom d’usuari o Email *",
          loginInputRequired: "El nom d’usuari o email és obligatori.",
          passwordLabel: "Contrasenya *",
          passwordRequired: "La contrasenya és obligatòria.",
          invalidCredentials: "Credencials incorrectes",
          success: "Login correcte!",
          error: "Hi ha hagut un error, torna-ho a provar",
          loading: "Iniciant sessió...",
          submit: "Login",
          forgotPassword: "He oblidat la contrasenya",
        },
        obra: {
          notFound: "Obra no trobada",
          loading: "Carregant obra...",
          backToPortfolio: "Tornar al portfoli",
          views: "visualitzacions",
          album: "Àlbum",
          prev: "Anterior",
          next: "Següent",
        },
        portfoli: {
          loading: "Carregant portfoli...",
          loadingObres: "Carregant obres...",
          noArtistId: "No s’ha proporcionat cap ID d’artista.",
          noPortfolio: "Aquest artista no té cap portfoli.",
          loadObresError: "No s'han pogut carregar les obres.",
        },
        publicObres: {
          title: "Obres",
          loading: "Carregant obres...",
        },
        register: {
          title: "Registrar-se",
          fields: {
            name: "Nom",
            email: "Email",
            password: "Password",
            passwordConfirmation: "Confirmar Password",
            avatar: "Avatar (opcional)",
          },
          errors: {
            name: "El nom és obligatori.",
            email: "L’email és obligatori.",
            password: "La contrasenya és obligatòria.",
            passwordConfirmation: "Les contrasenyes no coincideixen.",
          },
          buttons: {
            register: "Registrar-se",
            registering: "Registrant...",
          },
          notifications: {
            error: "No s'ha pogut registrar",
            success: "Registre correcte!",
            exception: "Hi ha hagut un error, torna-ho a provar",
          },
        },
        resetPassword: {
          title: "Restablir contrasenya",
          newPassword: "Nova contrasenya",
          confirmPassword: "Confirma la contrasenya",
          passwordPlaceholder: "Mínim 8 caràcters",
          confirmPasswordPlaceholder: "Torna a escriure la contrasenya",
          invalidLink: "Enllaç no vàlid o caducat",
          passwordTooShort: "La contrasenya ha de tenir mínim 8 caràcters",
          passwordsDontMatch: "Les contrasenyes no coincideixen",
          success: "Contrasenya canviada correctament!",
          linkExpired:
            "L'enllaç ha caducat o és incorrecte. Sol·licita un nou enllaç.",
          resetting: "Restablint...",
          button: "Restablir contrasenya",
        },
      },
    },
    en: {
      translation: {
        hero: {
          title: "Discover the artist's world",
          subtitle: "Explore each artist's vision",
          button: "Explore now",
          imageAlt: "Featured art",
        },
        nav: {
          artists: "Artists",
          works: "Works",
          myPortfolio: "My portfolio",
          editProfile: "Edit profile",
          login: "Login",
          register: "Register",
          logout: "Logout",
          hello: "Hi, {{name}}",
          avatarAlt: "User avatar",
        },
        common: {
          edit: "Edit",
          delete: "Delete",
          deleting: "Deleting...",
          cancel: "Cancel",
          saving: "Saving...",
          back: "Back",
          updating: "Updating...",
          confirm: "Confirm",
        },
        obres: {
          deleteSuccess: "Artwork successfully deleted!",
          deleteError: "The artwork could not be deleted.",
          confirmDeleteTitle: "Delete confirmation",
          confirmDeleteMessage: "Are you sure you want to delete this artwork?",
        },
        album: {
          fields: {
            name: "Album Name",
            description: "Description",
          },
          placeholders: {
            name: "Enter the album name",
            description: "Enter an optional description",
          },
          buttons: {
            create: "Create Album",
            update: "Update Album",
          },
          notifications: {
            createSuccess: "Album created successfully!",
            updateSuccess: "Album updated successfully!",
            deleteSuccess: "Album successfully deleted!",
          },
          errors: {
            requiredName: "Name field is required.",
            formError: "There are errors in the form.",
            saveError: "Failed to save the album.",
            loadObres: "Could not load artworks.",
            albumWithObres: "You cannot delete an album containing artworks.",
            deleteError: "Failed to delete album.",
          },
          loadingObres: "Loading artworks...",
          modal: {
            confirmDeleteTitle: "Delete confirmation",
            confirmDeleteMessage: "Are you sure you want to delete this album?",
          },
        },
        artistes: {
          title: "Explore Our Artists",
          description:
            "Discover the latest talents who have joined our community. Each artist brings their unique vision and creativity.",
        },
        editarPerfil: {
          title: "Edit Profile",
          fields: {
            name: "Name",
            email: "Email",
            password: "Password (leave empty to keep current)",
            image: "Profile image",
          },
          placeholders: {
            password: "••••••••",
          },
          buttons: {
            saveChanges: "Save Changes",
          },
          notifications: {
            updateSuccess: "Profile updated successfully",
          },
          errors: {
            loadProfile: "Failed to load user data",
            generic: "There was an error, please try again",
          },
        },
        errorBoundary: {
          fallback: "Something went wrong",
        },
        footer: {
          description:
            "Connect with artists and discover their works. Your passion for art, here.",
          links: {
            title: "Links",
            home: "Home",
            login: "Login",
            register: "Register",
          },
          contact: {
            title: "Contact",
            email: "Email: info@B612.art",
            phone: "Phone: +34 123 123 123",
          },
          bottom: "All rights reserved.",
        },
        obraForm: {
          addTitle: "Add Artwork",
          editTitle: "Edit Artwork",
          labels: {
            title: "Title",
            description: "Description",
            album: "Album",
            category: "Category",
            tags: "Tags",
            file: "File",
          },
          placeholders: {
            selectAlbum: "-- Select an album --",
            noAlbums: "No albums available",
            selectCategory: "-- Select a category --",
            noCategories: "No categories available",
            addTag: "-- Add tag --",
          },
          errors: {
            titleRequired: "Title is required.",
            albumRequired: "Select an album.",
            categoryRequired: "Select a category.",
            tagsRequired: "Add at least one tag.",
            fileRequired: "File is required.",
            loadTags: "Error loading tags",
            saveFailed: "Failed to save artwork.",
          },
          success: {
            created: "Artwork created successfully!",
            updated: "Artwork updated successfully!",
          },
          buttons: {
            add: "Add Artwork",
            update: "Update Artwork",
            saving: "Saving...",
          },
        },
        obresFilters: {
          allCategories: "All categories",
          allTags: "All tags",
        },
        obresSection: {
          title: "Works",
          subtitle:
            "Explore the unique galaxies and constellations of each artist",
          viewAll: "View All",
        },
        pagination: {
          prev: "Previous",
          next: "Next",
          page: "Page",
          of: "of",
        },
        portfolio: {
          createAlbum: "Create Album",
          createObra: "Create Work",
          editPortfolio: "Edit Portfolio",
          createAlbumFirst: "Create an album first",
          title: "Title",
          description: "Description",
          create: "Create",
          update: "Update",
          saving: "Saving...",
          created: "Portfolio created successfully!",
          updated: "Portfolio updated successfully!",
          titleRequired: "Title field is required.",
          errorTryAgain: "There was an error. Please try again.",
        },
        valor: {
          exploreArt: "Explore art like never before",
          description:
            "Discover emerging artists and their most fascinating works. Connect with creativity and inspiration at every step.",
          exclusive: {
            title: "Exclusive",
            text: "Access unique works and creators you won't find anywhere else.",
          },
          community: {
            title: "Community",
            text: "Join other art lovers and share your passion.",
          },
          inspiration: {
            title: "Inspiration",
            text: "Discover new styles and ideas with every visit.",
          },
        },
        artistesPage: {
          title: "Explore our artists",
          loading: "Loading artists...",
          noArtistes: "No artists available.",
          loadError: "Failed to load artists.",
          defaultName: "Artist",
        },
        crearAlbumPage: {
          loading: "Loading...",
          noPortfoli: "You need a portfolio before creating an album",
          backButton: "Back to dashboard",
          title: "Create new album",
        },
        crearObraPage: {
          loading: "Loading form...",
          loadError: "Failed to load data.",
          createTitle: "Create new work",
          editTitle: "Edit work",
        },
        crearPortfoliPage: {
          title: "Create your portfolio",
        },
        portfoliPage: {
          noArtistId: "Unable to determine the artist.",
          noPortfolioOwner:
            "You don’t have a portfolio yet. Create your first one!",
          noPortfolioUser: "This user doesn’t have a portfolio yet.",
          loadError: "Unable to load the portfolio.",
          loading: "Loading portfolio...",
          loadingObres: "Loading artworks...",
          hello: "Hello {{name}}!",
          noPortfolioMessage: "It’s the perfect time to showcase your talent!",
          createFirstPortfolio: "Create your first portfolio",
          defaultName: "artist",
        },
        editAlbum: {
          title: "Edit Album",
          loading: "Loading album...",
          noPermission: "You don't have permission to edit this album",
        },
        editObra: {
          title: "Edit Work",
          loading: "Loading form...",
          loadError: "Failed to load the work, albums, or categories.",
        },
        editarPortfoli: {
          title: "Edit Portfolio",
          loading: "Loading...",
          loadError: "Failed to load the portfolio.",
          notFound: "Portfolio not found.",
        },
        forgotPassword: {
          title: "Reset Password",
          emailLabel: "Email *",
          emailRequired: "Email is required",
          invalidEmail: "Invalid email format",
          emailInvalid: "Invalid email",
          serverError: "Could not connect to server",
          sending: "Sending...",
          sendButton: "Send Email",
        },
        login: {
          title: "Login",
          loginInputLabel: "Username or Email *",
          loginInputRequired: "Username or email is required.",
          passwordLabel: "Password *",
          passwordRequired: "Password is required.",
          invalidCredentials: "Invalid credentials",
          success: "Login successful!",
          error: "An error occurred, please try again",
          loading: "Logging in...",
          submit: "Login",
          forgotPassword: "Forgot password",
        },
        obra: {
          notFound: "Artwork not found",
          loading: "Loading artwork...",
          backToPortfolio: "Back to portfolio",
          views: "views",
          album: "Album",
          prev: "Previous",
          next: "Next",
        },
        portfoli: {
          loading: "Loading portfolio...",
          loadingObres: "Loading works...",
          noArtistId: "No artist ID provided.",
          noPortfolio: "This artist does not have a portfolio.",
          loadObresError: "Could not load the works.",
        },
        publicObres: {
          title: "Works",
          loading: "Loading works...",
        },
        register: {
          title: "Register",
          fields: {
            name: "Name",
            email: "Email",
            password: "Password",
            passwordConfirmation: "Confirm Password",
            avatar: "Avatar (optional)",
          },
          errors: {
            name: "Name is required.",
            email: "Email is required.",
            password: "Password is required.",
            passwordConfirmation: "Passwords do not match.",
          },
          buttons: {
            register: "Register",
            registering: "Registering...",
          },
          notifications: {
            error: "Could not register",
            success: "Registration successful!",
            exception: "There was an error, please try again",
          },
        },
        resetPassword: {
          title: "Reset Password",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          passwordPlaceholder: "Minimum 8 characters",
          confirmPasswordPlaceholder: "Re-enter your password",
          invalidLink: "Invalid or expired link",
          passwordTooShort: "Password must be at least 8 characters long",
          passwordsDontMatch: "Passwords do not match",
          success: "Password changed successfully!",
          linkExpired: "The link is expired or invalid. Request a new one.",
          resetting: "Resetting...",
          button: "Reset Password",
        },
      },
    },
  },
});

export default i18n;
