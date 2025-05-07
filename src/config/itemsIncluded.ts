export const ITEMS_INCLUDED = {
    WAKEBOARD: 'Wakeboard',
    BINDINGS: 'Bindings',
    HELMET: 'Helmet',
    GOPRO_MOUNT: 'GoPro Mount',
    WETSUIT: 'Wetsuit',
    RASH_GUARD: 'Rash Guard',
    WATER_SKI: 'Water Ski',
    PADDLEBOARD: 'Paddleboard',
    PADDLE: 'Paddle',
    GOGGLES: 'Goggles',
    LIFE_JACKET: 'Life Jacket',
    LIFE_VEST: 'Life Vest'
  } as const;
  
  export type ItemIncludedKey = keyof typeof ITEMS_INCLUDED;
  export type ItemIncludedValue = typeof ITEMS_INCLUDED[ItemIncludedKey];