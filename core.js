/* ============================================================
   THE BUREAU — SOCLE COMMUN JS / CHARTE PARTAGEE
   Team Lounge  &  Broker Lounge
   ------------------------------------------------------------
   Fichier CANONIQUE : teamlounge/core.js
   NE PAS editer la copie de brokerlounge a la main.
   Modifier ici puis lancer :  python sync-shared.py
============================================================ */

/* View Transitions : wrappe une bascule UI dans document.startViewTransition
   si le navigateur le supporte, sinon execute directement. */
function withVT(fn){ if(document.startViewTransition){ try{ document.startViewTransition(fn); }catch(e){ fn(); } } else { fn(); } }
