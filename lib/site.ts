/** Brand + content sourced from https://www.hawaiianrumblegolf.com/ */

export const site = {
  name: "Hawaiian Rumble Adventure Golf",
  shortName: "Hawaiian Rumble",
  tagline: "A tropical adventure—one putt at a time",
  description:
    "Mini golf near Disney World in Orlando, FL. Two 18-hole courses, music, candy shop, and cold drinks—open 7 days a week.",
  url: "https://www.hawaiianrumblegolf.com",
  phone: "407-239-8300",
  phoneTel: "+14072398300",
  addressLine: "13529 State Road 535",
  cityStateZip: "Orlando, FL 32821",
  mapsUrl:
    "https://www.google.com/maps/place/Hawaiian+Rumble+Adventure+Golf/@28.368194,-81.502057,16z",
  facebookUrl: "https://www.facebook.com/HawaiianRumbleGolf/",
  texasMovieShopUrl: "https://www.texasmovieshop.com/",
  coordinates: { lat: 28.368194, lng: -81.502057 },
  hours: {
    week: "Sunday – Thursday | 10:00 AM – 10:00 PM",
    weekend: "Friday & Saturday | 10:00 AM – 11:30 PM",
  },
  rates: {
    /** Two-column ticket board (cash pricing). */
    title: "Ticket rates",
    leftColumn: [
      {
        label: "One game — Adult",
        detail: "18 holes",
        price: "13.95",
        pricePrefix: "",
      },
      {
        label: "One game — Child",
        detail: "18 holes · Ages 10 & under",
        price: "11.95",
        pricePrefix: "",
      },
      {
        label: "Two games",
        detail: "36 holes · Play both courses!",
        price: "4.95",
        pricePrefix: "+",
        priceNote: "Add-on with first round",
      },
    ],
    rightColumn: [
      {
        label: "One game + CiCi's Pizza",
        detail: "Play one course and enjoy CiCi's Pizza Buffet*",
        price: "24.95",
        pricePrefix: "",
      },
      {
        label: "Two games + CiCi's Pizza",
        detail: "Play both courses and enjoy CiCi's Pizza Buffet*",
        price: "29.95",
        pricePrefix: "",
      },
      {
        label: "Unlimited",
        detail: "Bottomless same-day mini golf!",
        price: "24.95",
        pricePrefix: "",
        highlight: true,
      },
    ],
    footnotes: [
      "Drinks are not included with CiCi's Buffet.",
      "Prices above reflect regular cash price.",
      "All rates are per person.",
    ],
  },
  highlights: [
    "18 holes · wheelchair accessible",
    "Located ~1 mile from Walt Disney World & Disney Springs",
    "Special discounts: military, seniors, FL residents, Disney & Universal cast",
  ],
} as const;

/** High-res assets from the live Wix site (same imagery as hawaiianrumblegolf.com). */
export const media = {
  hero: "https://static.wixstatic.com/media/b4b2ad_1b2aef21b5934f028c97725582917b77~mv2.jpg/v1/fit/w_1920,h_1282,q_90,enc_avif,quality_auto/b4b2ad_1b2aef21b5934f028c97725582917b77~mv2.jpg",
  gallery: [
    "https://static.wixstatic.com/media/b4b2ad_a8df8592f79543b2bfdf302e0a5ccdc4~mv2.jpg/v1/fit/w_1200,h_800,q_90,enc_avif,quality_auto/b4b2ad_a8df8592f79543b2bfdf302e0a5ccdc4~mv2.jpg",
    "https://static.wixstatic.com/media/b4b2ad_b019c9b2c93047dbb432feda0edb376f~mv2.jpg/v1/fit/w_1200,h_800,q_90,enc_avif,quality_auto/b4b2ad_b019c9b2c93047dbb432feda0edb376f~mv2.jpg",
    "https://static.wixstatic.com/media/b4b2ad_e2795a9668504df99a8ca524a0aff253~mv2.jpg/v1/fit/w_1200,h_800,q_90,enc_avif,quality_auto/b4b2ad_e2795a9668504df99a8ca524a0aff253~mv2.jpg",
    "https://static.wixstatic.com/media/b4b2ad_5473dfb89f204e359fc91a2e3748c51b~mv2.jpg/v1/fit/w_960,h_1440,q_90,enc_avif,quality_auto/b4b2ad_5473dfb89f204e359fc91a2e3748c51b~mv2.jpg",
    "https://static.wixstatic.com/media/b4b2ad_cbc238c0f38c4e84b5b4f8d193f46a08~mv2.jpg/v1/fit/w_1200,h_800,q_90,enc_avif,quality_auto/b4b2ad_cbc238c0f38c4e84b5b4f8d193f46a08~mv2.jpg",
    "https://static.wixstatic.com/media/b4b2ad_d3caed0732a34d7095996b2092e4e8e8~mv2.jpg/v1/fit/w_960,h_1000,q_90,enc_avif,quality_auto/b4b2ad_d3caed0732a34d7095996b2092e4e8e8~mv2.jpg",
  ],
  giftShop: "https://static.wixstatic.com/media/b4b2ad_d73eebdfe97345dcad2a8b278e5ac8ea~mv2.jpg/v1/fit/w_1400,h_934,q_90,enc_avif,quality_auto/b4b2ad_d73eebdfe97345dcad2a8b278e5ac8ea~mv2.jpg",
  refreshments: "https://static.wixstatic.com/media/b4b2ad_5a02092a782840dba31cdde68112b6a7~mv2.jpg/v1/fit/w_1400,h_934,q_90,enc_avif,quality_auto/b4b2ad_5a02092a782840dba31cdde68112b6a7~mv2.jpg",
} as const;
