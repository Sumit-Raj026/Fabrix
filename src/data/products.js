// Mock product data for Fabrix catalog with local image paths for reliability

export const PRODUCTS = [
  {
    id: "FX-001",
    title: "Minimalist Ribbed Ceramic Vase",
    category: "Home Decor",
    price: 1850,
    description: "A gorgeous, matte-finished ceramic vase featuring a delicate ribbed texture. Its neutral cream color and organic silhouette make it a perfect centerpiece for minimalist dried flora or single branches.",
    details: [
      "Material: 100% Stoneware Ceramic",
      "Dimensions: 8.5\" Height x 4.2\" Diameter",
      "Finish: Matte Cream Sand glaze",
      "Care: Hand wash only"
    ],
    images: [
      "/images/vase_1.jpg",
      "/images/vase_2.jpg",
      "/images/vase_3.jpg"
    ],
    customizable: false
  },
  {
    id: "FX-002",
    title: "Handwoven Linen Cushion Cover",
    category: "Home Decor",
    price: 1200,
    description: "Woven by skilled artisans from organic Belgian flax, this cushion cover brings rich texture and soft, natural color to your living space. Features a concealed zipper closure.",
    details: [
      "Material: 100% Belgian Flax Linen",
      "Dimensions: 18\" x 18\" (45cm x 45cm)",
      "Color: Olive Sage & Natural Oatmeal",
      "Closure: High-quality hidden YKK zipper",
      "Care: Machine wash cold, line dry"
    ],
    images: [
      "/images/cushion_1.jpg",
      "/images/cushion_2.jpg",
      "/images/cushion_3.jpg"
    ],
    customizable: true,
    customizationLabel: "Monogram Lettering (Max 3 characters)"
  },
  {
    id: "FX-003",
    title: "Oak Wood Serving Tray with Brass Handles",
    category: "Household Goods",
    price: 2450,
    description: "Crafted from solid kiln-dried white oak, this serving tray is both functional and decorative. The rich wood grain is accented by solid brushed brass handles, adding a warm, sophisticated feel.",
    details: [
      "Material: Solid White Oak, Brass",
      "Dimensions: 16\" Length x 12\" Width x 1.5\" Height",
      "Finish: Food-safe natural oil rub",
      "Care: Wipe with damp cloth, oil occasionally"
    ],
    images: [
      "/images/tray_1.jpg",
      "/images/tray_2.jpg",
      "/images/tray_3.jpg"
    ],
    customizable: true,
    customizationLabel: "Engraving Text (e.g. 'The Smiths' or initials)"
  },
  {
    id: "FX-004",
    title: "Organic Cotton Waffle Towel Set",
    category: "Household Goods",
    price: 3200,
    description: "Ultra-absorbent, quick-drying waffle-weave bath towels woven from premium long-staple organic cotton. They gently exfoliate while remaining exceptionally soft and luxurious.",
    details: [
      "Set includes: 2 Bath Towels, 2 Hand Towels",
      "Material: 100% GOTS Certified Organic Cotton",
      "Weight: 450 GSM",
      "Color: Warm Charcoal & Soft Sand",
      "Care: Machine wash warm, tumble dry low"
    ],
    images: [
      "/images/towels_1.jpg",
      "/images/towels_2.jpg",
      "/images/towels_3.jpg"
    ],
    customizable: false
  },
  {
    id: "FX-005",
    title: "Custom Engraved Brass Nameplate",
    category: "Customized Items",
    price: 2900,
    description: "Make a striking first impression with this premium solid brass nameplate. Mounted on a block of reclaimed dark teak wood, the brass is deeply engraved with your custom family name or house number.",
    details: [
      "Material: Premium Solid Brass, Reclaimed Teak Wood",
      "Dimensions: 10\" Width x 4\" Height x 0.8\" Depth",
      "Hardware: Wall mounting screws and anchors included",
      "Customization: Deep laser-etched black filled lettering"
    ],
    images: [
      "/images/nameplate_1.jpg",
      "/images/nameplate_2.jpg",
      "/images/nameplate_3.jpg"
    ],
    customizable: true,
    customizationLabel: "Name or Text to Engrave (e.g., 'THE MEHTAS', 'Flat 402')"
  },
  {
    id: "FX-006",
    title: "Personalized Leather Valet Tray",
    category: "Customized Items",
    price: 1600,
    description: "Keep your daily essentials organized in style. This catch-all tray is crafted from full-grain vegetable-tanned leather with burnished edges and brass snaps. Flat-packs for travel and snaps together in seconds.",
    details: [
      "Material: Full-grain Vegetable-tanned Leather, Solid Brass snaps",
      "Dimensions (Snapped): 7\" x 7\" x 1.5\"",
      "Color: Heritage Tan",
      "Customization: Hot-foil gold stamped initials (Max 4 letters)"
    ],
    images: [
      "/images/leather_1.jpg",
      "/images/leather_2.jpg",
      "/images/leather_3.jpg"
    ],
    customizable: true,
    customizationLabel: "Initials for Stamping (e.g., 'S.K.')"
  }
];
