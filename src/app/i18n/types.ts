export type Language = "zh" | "en";

export interface Translations {
  nav: {
    products: string;
    specs: string;
    reviews: string;
    support: string;
  };
  hero: {
    learnMore: string;
    prevBanner: string;
    nextBanner: string;
    goToBanner: string;
  };
  products: {
    title: string;
    subtitle: string;
    caseFan: string;
    cpuCooler: string;
    highlights: string;
    viewDetails: string;
  };
  specs: {
    title: string;
    subtitle: string;
  };
  reviews: {
    title: string;
    rating: string;
    basedOn: string;
    customerReviews: string;
    writeReview: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    ratingLabel: string;
    reviewContent: string;
    reviewPlaceholder: string;
    submitReview: string;
    submitting: string;
    nameError: string;
    emailError: string;
    emailPrivacy: string;
    adminLoggedIn: string;
    logout: string;
    adminLogin: string;
    adminOnly: string;
    account: string;
    password: string;
    cancel: string;
    login: string;
    loggingIn: string;
    reply: string;
    submitReply: string;
    delete: string;
    confirmDelete: string;
    deleteWarning: string;
    demoReview: string;
    replyBy: string;
    charsLimit: string;
  };
  support: {
    faq: string;
    downloads: string;
    contact: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    inquiryTypes: string[];
    message: string;
    messagePlaceholder: string;
    sendMessage: string;
    sending: string;
    successMessage: string;
    errorMessage: string;
    nameError: string;
    emailError: string;
    warranty: string;
    warrantyItems: string[];
    noFaq: string;
    noDownloads: string;
  };
  footer: {
    tagline: string;
    products: string;
    support: string;
    contact: string;
    notConfigured: string;
    rights: string;
    privacy: string;
    terms: string;
    cookies: string;
  };
  common: {
    switchLang: string;
  };
}
