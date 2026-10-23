# Focus Cinema School — Landing page

Sito statico (HTML, CSS, JavaScript): nessun database, nessun cookie, nessuna risorsa esterna.
Si pubblica caricando l'intera cartella su qualsiasi hosting (Netlify, Vercel, GitHub Pages, hosting tradizionale).

## Aggiornare i contenuti

Tutto ciò che cambia nel tempo si trova in **`data/contenuti.js`**:

| Cosa | Dove |
|---|---|
| Date, costi, sede, posti, stato dei workshop | `workshop` |
| Nuovi registi, biografie, filmografie, ritratti | `registi` |
| Foto e video della galleria | `galleria` |
| Domande frequenti | `faq` |
| WhatsApp, email, Instagram | `contatti` |
| Dati legali del footer | `legale` |
| Foto o video della prima schermata | `hero` |

**Stati dei workshop:** `aperte`, `soldout`, `programma`, `annullato`.
- Un workshop con data di fine passata diventa automaticamente "concluso" e scompare dai prossimi.
- Un workshop `annullato` non viene mai mostrato.
- I campi lasciati vuoti mostrano "Da comunicare" o "Su richiesta": nessun dato viene inventato.

**Iscrizione e pagamento online (in futuro):** compila `linkIscrizione` nel workshop; comparirà il pulsante "Iscriviti".

## Immagini

- Inserisci i file in `assets/img/` (JPG ottimizzati, lato lungo massimo ~1600px, < 300 KB).
- I ritratti attuali dei registi sono ritagliati dalle locandine Instagram: **sostituiscili con le foto originali in alta risoluzione** (formato 4:5, stesso nome file).
- Galleria e sezione "La scuola" mostrano cornici segnaposto finché non inserisci materiale autentico e autorizzato.

## Modulo contatti

Senza configurazione, il modulo apre il programma di posta con il messaggio già compilato.
Per riceverlo direttamente, crea un modulo su un servizio come Formspree e incolla l'indirizzo in `moduloEndpoint`.
In quel caso aggiorna anche l'informativa privacy con il nome del fornitore.

## Da completare prima della pubblicazione

- [ ] Dati legali in `data/contenuti.js` → `legale`
- [ ] Parti evidenziate in `privacy.html` (titolare, hosting, tempi di conservazione), da far verificare a un consulente
- [ ] Indirizzo del dominio: decommenta `<link rel="canonical">` in `index.html` e aggiorna `og:image` con l'URL completo
- [ ] Biografie verificate di Fabrizio Benvenuto e Marco Simon Puccioni
- [ ] Costi e sedi dei workshop

## Anteprima locale

```
python3 -m http.server 8000
```
poi apri http://localhost:8000
