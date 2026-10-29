// Waitlist delivery settings. Signups are delivered by Formspree (free tier,
// 50 submissions/month, no backend needed).
//
// To turn signups on:
//   1. Sign in at https://formspree.io and create a form. Set the recipient
//      to the bake shop inbox.
//   2. The form's endpoint looks like https://formspree.io/f/abcdwxyz.
//      Paste the id (the part after /f/) below.
//   3. Push to main. The deploy workflow publishes it.
//
// Until the placeholder is replaced, the form renders but submissions fail,
// and `npm run build` prints a warning.
export const FORMSPREE_FORM_ID = "YOUR_FORM_ID";

export const PLACEHOLDER_ID = "YOUR_FORM_ID";
export const isWaitlistConfigured = FORMSPREE_FORM_ID !== PLACEHOLDER_ID;
export const WAITLIST_ACTION = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
