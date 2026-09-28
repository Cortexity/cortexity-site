/** Browser-side Meta Pixel helpers. All calls are no-ops when the pixel is not configured. */

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Fbq = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function fbq(...args: unknown[]) {
  if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  window.fbq(...args);
}

export const trackPageView = () => fbq("track", "PageView");
export const track = (event: string, params: Record<string, unknown> = {}, eventID?: string) =>
  fbq("track", event, params, eventID ? { eventID } : undefined);
export const trackCustom = (event: string, params: Record<string, unknown> = {}, eventID?: string) =>
  fbq("trackCustom", event, params, eventID ? { eventID } : undefined);

/** The standard Meta Pixel base code (loads fbevents.js, inits the pixel). PageView is fired by <MetaPixel/>. */
export const pixelBaseCode = (id: string) =>
  `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(id)});`;
