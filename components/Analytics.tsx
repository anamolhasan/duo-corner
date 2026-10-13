"use client";

import Script from "next/script";

export default function Analytics() {
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const ytTagId = process.env.NEXT_PUBLIC_YT_TAG_ID;

  return (
    <>
      {/* ১. ফেসবুক পিক্সেল */}
      {fbPixelId && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=true;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* ২. টিকটক পিক্সেল */}
      {tiktokPixelId && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._instance[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};var s=d.createElement("script");s.type="text/javascript",s.async=!0,s.src="https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+t+"&lib="+ttq;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a);
              }(window, document, 'ttq');
              ttq.load('${tiktokPixelId}');
              ttq.page();
            `,
          }}
        />
      )}

      {/* ৩. গুগল ট্যাগ ম্যানেজার (GTM) */}
      {gtmId && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}

      {/* ৪. ইউটিউব ট্র্যাকিং ট্যাগ */}
      {ytTagId && (
        <Script
          id="youtube-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ytTagId}');
            `,
          }}
        />
      )}
    </>
  );
}