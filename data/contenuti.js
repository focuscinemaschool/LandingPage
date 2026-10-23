/* =====================================================================
   FOCUS CINEMA SCHOOL — CONTENUTI MODIFICABILI
   ---------------------------------------------------------------------
   Questo è l'unico file da toccare per aggiornare workshop, registi,
   galleria, FAQ e contatti. Non serve conoscere HTML.

   Regole:
   - Lascia un campo a "" (vuoto) o null se l'informazione non è ancora
     confermata: il sito mostrerà "Da comunicare" / "Su richiesta"
     invece di inventare un dato.
   - Le date vanno nel formato "AAAA-MM-GG".
   - Un workshop con data di fine già passata viene spostato
     automaticamente tra i "conclusi", qualunque sia il suo stato.
   - Un workshop con stato "annullato" non viene mai mostrato.
   ===================================================================== */

window.FOCUS = {

  /* ---------------- CONTATTI ---------------- */
  contatti: {
    whatsapp: "393461458985",            // solo cifre, con prefisso internazionale
    whatsappLabel: "+39 346 145 8985",
    email: "focuscinemaschool@gmail.com",
    instagram: "https://www.instagram.com/focuscinemaschool/",
    citta: "Roma"
  },

  /* Endpoint del modulo contatti (Formspree, Netlify Forms, backend…).
     Se vuoto, il modulo apre il programma di posta con il messaggio già compilato. */
  moduloEndpoint: "",

  /* Dati legali del soggetto che gestisce il progetto — DA COMPLETARE.
     Finché sono vuoti, nel footer compare un segnaposto. */
  legale: {
    titolare: "",       // es. ragione sociale o nome dell'associazione
    sede: "",           // indirizzo della sede legale
    piva: "",           // P. IVA / C.F.
    altro: ""           // es. REA, numero iscrizione registro, ecc.
  },

  /* ---------------- HERO ----------------
     Quando avrai materiale autorizzato dal set, indica qui il percorso.
     Il video deve essere breve, senza audio, compresso (mp4 H.264 < 6 MB). */
  hero: {
    video: "",          // es. "assets/video/set.mp4"
    immagine: ""        // es. "assets/img/hero-set.jpg" (usata anche come poster del video)
  },

  /* Fotografia della sezione "La scuola" */
  scuolaImmagine: {
    src: "",            // es. "assets/img/scuola.jpg"
    alt: ""
  },

  /* ---------------- REGISTI ----------------
     bio: breve biografia VERIFICATA (se vuota non viene mostrata).
     lavori: film o serie più significativi.
     Collaboratori di Focus Cinema School. Il collegamento a un workshop
     compare SOLO se esiste un workshop in programma con lo stesso "id" regista. */
  registi: [
    {
      id: "ciarrapico",
      nome: "Giacomo Ciarrapico",
      ruolo: "Regista e sceneggiatore",
      foto: "assets/img/giacomo-ciarrapico.jpg",
      bio: "Tra gli autori della serie Boris.",
      lavori: ["Boris"]
    },
    {
      id: "benvenuto",
      nome: "Fabrizio Benvenuto",
      ruolo: "Regista",
      foto: "assets/img/fabrizio-benvenuto.jpg",
      bio: "",                // da completare con una biografia verificata
      lavori: ["Il protagonista"]
    },
    {
      id: "puccioni",
      nome: "Marco Simon Puccioni",
      ruolo: "Regista",
      foto: "assets/img/marco-simon-puccioni.jpg",
      bio: "",                // da completare con una biografia verificata
      lavori: ["Il filo invisibile", "Come il vento", "Riparo"]
    }
  ],

  /* ---------------- WORKSHOP ----------------
     stato: "aperte" | "soldout" | "programma" | "concluso" | "annullato"
     linkIscrizione: in futuro, link a un sistema di iscrizione/pagamento.
     Se compilato, compare il pulsante "Iscriviti". */
  workshop: [
    {
      id: "ciarrapico-2026-11",
      regista: "ciarrapico",
      titolo: "Workshop di recitazione",
      inizio: "2026-11-21",
      fine: "2026-11-22",
      citta: "Roma",
      sede: "",
      durata: "",            // vuoto = calcolata dalle date (es. "2 giorni")
      descrizione: "Un lavoro pratico sulla recitazione davanti alla camera.",
      costo: "",
      posti: "A numero chiuso",
      stato: "aperte",
      linkIscrizione: ""
    },
    {
      id: "benvenuto-2026-12",
      regista: "benvenuto",
      titolo: "Workshop di recitazione",
      inizio: "2026-12-11",
      fine: "2026-12-13",
      citta: "Roma",
      sede: "",
      durata: "",
      descrizione: "Un lavoro pratico sulla recitazione davanti alla camera.",
      costo: "",
      posti: "A numero chiuso",
      stato: "soldout",
      linkIscrizione: ""
    },
    {
      id: "puccioni-2026-12",
      regista: "puccioni",
      titolo: "Workshop di recitazione",
      inizio: "2026-12-19",
      fine: "2026-12-20",
      citta: "Roma",
      sede: "",
      durata: "",
      descrizione: "Un lavoro pratico sulla recitazione davanti alla camera.",
      costo: "",
      posti: "A numero chiuso",
      stato: "aperte",
      linkIscrizione: ""
    }
  ],

  /* Mostrare in fondo alla sezione l'elenco dei workshop già conclusi? */
  mostraConclusi: true,

  /* ---------------- GALLERIA ----------------
     Inserisci SOLO materiale autentico e autorizzato.
     tipo: "foto" | "video". Finché src è vuoto, compare una cornice segnaposto.
     L'impaginazione segue l'ordine (schema che si ripete ogni 6 elementi). */
  galleria: [
    { tipo: "foto", src: "", alt: "", didascalia: "Attori durante la preparazione" },
    { tipo: "foto", src: "", alt: "", didascalia: "Il regista dirige la scena" },
    { tipo: "foto", src: "", alt: "", didascalia: "Macchina da presa e monitor" },
    { tipo: "foto", src: "", alt: "", didascalia: "Durante le riprese" },
    { tipo: "foto", src: "", alt: "", didascalia: "Confronto sul lavoro" },
    { tipo: "video", src: "", poster: "", alt: "", didascalia: "Estratto dal set" },
  ],

  /* ---------------- FAQ ----------------
     Le risposte possono contenere semplice HTML (<strong>, <a>). */
  faq: [
    {
      d: "A chi sono rivolti i workshop?",
      r: "Ad attrici e attori che vogliono lavorare sulla recitazione davanti alla macchina da presa, confrontandosi direttamente con registi professionisti."
    },
    {
      d: "È necessaria un'esperienza precedente?",
      r: "Dipende dal workshop e dal regista che lo conduce. Scrivici: ti diremo se il percorso è adatto alla tua esperienza."
    },
    {
      d: "Come si svolge un workshop?",
      r: "È un lavoro pratico: preparazione delle scene, lavoro con il regista sull'interpretazione e sulle relazioni tra i personaggi, e riprese davanti alla camera. La struttura specifica può variare in base al workshop e al regista."
    },
    {
      d: "Bisogna preparare le scene in anticipo?",
      r: "In genere gli attori ricevono i testi prima dell'incontro con il regista, per studiare i personaggi e preparare le scene. Le indicazioni precise vengono comunicate agli iscritti di ciascun workshop."
    },
    {
      d: "Le scene vengono riprese?",
      r: "Sì, il lavoro prevede le riprese davanti alla macchina da presa. Per sapere se e in che modo riceverai il materiale girato, chiedi informazioni sul workshop che ti interessa."
    },
    {
      d: "Come funzionano le iscrizioni?",
      r: "Le iscrizioni sono a numero chiuso. Per iscriverti o ricevere informazioni su costi e disponibilità, scrivici su WhatsApp o via email."
    },
    {
      d: "Dove si svolgono le attività?",
      r: "Le attività si svolgono a Roma. La sede di ogni workshop viene comunicata al momento dell'iscrizione o su richiesta."
    },
    {
      d: "Come funzionerà la realizzazione dei cortometraggi?",
      r: "Il progetto prevede sceneggiature originali scritte da registi professionisti e tre giorni di lavoro su un set cinematografico. Modalità di partecipazione, date e costi non sono ancora definitivi: contattaci per ricevere aggiornamenti."
    }
  ]
};
