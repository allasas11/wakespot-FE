export const CATEGORIES = {
    WAKEBOARD: "wakeboard",
    SKI: "ski",
    PADDLE: "paddle",
    KAYAK: "kayak",
    SUP: "sup",
    OTHER: "other",
  } as const;
  
  export type CategoryKey = keyof typeof CATEGORIES;
  export type CategoryValue = typeof CATEGORIES[CategoryKey];

  export const CATEGORY_LABELS: Record<CategoryValue, string> = {
    wakeboard: 'Wakeboarding',
    ski: 'Water Skiing',
    paddle: 'Paddleboarding',
    kayak: 'Kayaking',
    sup: 'Stand-Up Paddle (SUP)',
    other: 'Other Gear'
  };