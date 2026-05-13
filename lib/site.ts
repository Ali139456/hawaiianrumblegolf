/** Brand + content sourced from https://www.hawaiianrumblegolf.com/ */

export const site = {
  name: "Hawaiian Rumble Adventure Golf",
  shortName: "Hawaiian Rumble",
  tagline: "A tropical adventure, one putt at a time",
  description:
    "Mini golf near Disney World in Orlando, FL. Two 18-hole courses, music, candy shop, and cold drinks. Open 7 days a week.",
  url: "https://www.hawaiianrumblegolf.com",
  phone: "407-239-8300",
  phoneTel: "+14072398300",
  addressLine: "13529 State Road 535",
  cityStateZip: "Orlando, FL 32821",
  mapsUrl:
    "https://www.google.com/maps/place/Hawaiian+Rumble+Adventure+Golf/@28.368194,-81.502057,1086m/data=!3m1!1e3!4m6!3m5!1s0x88dd80319742cd39:0x81207cfe8bee0590!8m2!3d28.3679948!4d-81.5016732!16s%2Fg%2F1tfbtpp_",
  facebookUrl: "https://www.facebook.com/hawaiianrumblegolf/",
  yelpUrl: "https://www.yelp.com/biz/hawaiian-rumble-adventure-golf-orlando-2",
  tripAdvisorUrl:
    "https://www.tripadvisor.com/Attraction_Review-g34515-d2312525-Reviews-Hawaiian_Rumble_Adventure_Golf-Orlando_Florida.html",
  /** Opens this listing’s Google Maps reviews tab (same place as `mapsUrl`). */
  googleMapsReviewsUrl:
    "https://www.google.com/maps/place/Hawaiian+Rumble+Adventure+Golf/reviews/@28.368194,-81.502057,1086m/data=!3m1!1e3!4m6!3m5!1s0x88dd80319742cd39:0x81207cfe8bee0590!8m2!3d28.3679948!4d-81.5016732!16s%2Fg%2F1tfbtpp_",
  /**
   * Optional. Prefer setting `GOOGLE_PLACE_ID` in the environment for production.
   * Used with the Places API and the “Write a review” shortcut when live reviews load.
   */
  googlePlaceId: "",
  texasMovieShopUrl: "https://www.texasmovieshop.com/",
  coordinates: { lat: 28.3679948, lng: -81.5016732 },
  hours: {
    week: "Sunday – Thursday | 10:00 AM – 10:00 PM",
    weekend: "Friday & Saturday | 10:00 AM – 11:30 PM",
  },
  /** Scrolling marketing ticker (see `MarketingTicker`). */
  tickerLines: [
    "Open 7 days · Sun–Thu 10AM–10PM · Fri–Sat 10AM–11:30PM",
    "Same-day 2nd game $9.95 · replay pricing after your first paid round",
    "1st round $15.95 per person · stack a second 18 the same day and save",
    "Two full 18-hole courses · lights · music · island energy",
    "~1 mile from Walt Disney World & Disney Springs",
    "Military · seniors · Florida residents · Disney & Universal cast · discounts at the window",
    "Wheelchair accessible paths · refreshments & candy at the clubhouse",
    "Groups of 20+ · special per-person rate · ask about parties & outings",
    "The Great Texas Movie Shop on site · posters, collectibles & more",
  ] as const,
  rates: {
    title: "Rates",
    leftColumnTitle: "Single rates",
    leftColumnSub: "Per person",
    rightColumnTitle: "Group rates",
    rightColumnSub: "Per person",
    leftColumn: [
      {
        label: "1st game",
        detail: "Full-price round · your first game of the day",
        price: "15.95",
        pricePrefix: "",
      },
      {
        label: "2nd game",
        detail: "Same day only · come back for another 18 right after your first round",
        price: "9.95",
        /** Shown struck-through next to the sale price (matches 1st-game rate). */
        compareAtPrice: "15.95",
        pricePrefix: "",
        badge: "Best value",
        highlight: true,
      },
    ],
    rightColumn: [
      {
        label: "Group rate",
        detail: "Minimum of 20 people for group rates",
        price: "12.95",
        pricePrefix: "",
        cta: { href: "#contact", label: "Contact us for more information" },
      },
    ],
    footnotes: [
      "2nd-game rate is for an additional round the same day as a paid 1st game, like a built-in replay deal.",
      "Single and group rates are per person unless noted.",
      "Contact us for more information about group outings and parties.",
      "Prices may change; confirm current rates at the clubhouse.",
    ],
  },
  highlights: [
    "18 holes · wheelchair accessible",
    "Located ~1 mile from Walt Disney World & Disney Springs",
    "Special discounts: military, seniors, FL residents, Disney & Universal cast",
  ],
  /**
   * `/deals` page (and future admin dashboard). Swap this object for API/CMS data later.
   */
  dealsPage: {
    title: "Deals & specials",
    subtitle:
      "Ways to save when you play with us. These fields are ready to be driven by an owner admin later (edit deals, hours, and promos in one place).",
    footnote: "Prices and offers can change. Confirm at the clubhouse or call before you visit.",
    cards: [
      {
        title: "Same-day 2nd game",
        badge: "Best value",
        body: "Play your first round at the regular rate, then add another 18 the same day at replay pricing.",
        price: "$9.95",
        compareAt: "$15.95",
        hint: "Per person · same calendar day",
      },
      {
        title: "Group rate",
        badge: "20+ guests",
        body: "Parties, teams, schools, and reunions. Reach out to reserve your date and head count.",
        price: "$12.95",
        compareAt: "",
        hint: "Per person · minimum 20 players",
      },
      {
        title: "Window discounts",
        badge: "Ask at check-in",
        body: "Reduced rates may be available for military, seniors, Florida residents, and Disney & Universal cast.",
        price: "Ask us",
        compareAt: "",
        hint: "ID may be required",
      },
    ],
  },
  /** Shown when Google Places API is not configured or returns no reviews. */
  featuredTestimonials: [
    {
      name: "Sarah M.",
      quote:
        "Such a fun course after a day at the parks. The music and lights made it feel like a vacation night out.",
      rating: 5,
    },
    {
      name: "James & Priya",
      quote:
        "Two full 18-hole courses kept our family busy for hours. Staff was friendly and the clubhouse snacks were a hit.",
      rating: 5,
    },
    {
      name: "Elena R.",
      quote:
        "Wheelchair-accessible paths were smooth and easy to navigate. We will definitely come back next trip.",
      rating: 5,
    },
    {
      name: "Marcus T.",
      quote:
        "Great value for Orlando. Loved the tropical vibe: challenging enough for adults, still perfect for kids.",
      rating: 5,
    },
    {
      name: "Danielle K.",
      quote:
        "We booked this after Magic Kingdom and it was the perfect wind-down. Music everywhere, nothing cheesy, just fun holes and cold drinks at the clubhouse.",
      rating: 5,
    },
    {
      name: "Chris & Avery",
      quote:
        "Birthday party for our 10-year-old: easy parking, friendly staff, and the kids talked about it all week. Already planning round two on our next Orlando trip.",
      rating: 5,
    },
    {
      name: "Renee L.",
      quote:
        "Love that we could play two courses without driving across town. Second-game pricing same day made it easy to say yes when the kids begged for another round.",
      rating: 5,
    },
    {
      name: "Tomás V.",
      quote:
        "Clean, well-kept greens and clever obstacles. Felt like a mini vacation without the resort price tag. Cast discount was a nice surprise at the window.",
      rating: 5,
    },
    {
      name: "The Nguyen family",
      quote:
        "Grandparents could ride along comfortably and the paths were easy for our stroller. Candy shop on the way out made us heroes with the little ones.",
      rating: 5,
    },
  ],
} as const;

export type SiteConfig = typeof site;

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
