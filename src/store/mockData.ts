export type CarSummary = {
  id: string
  name: string
  subtitle?: string
  image: string
  price: number
  popularity?: number
  images?: string[]
  specs?: {
    power?: string
    range?: string
    drive?: string
    year?: string
  }
  description?: string
}

export type CarDetail = CarSummary & {
  images: string[]
}

// Placeholder images via picsum
const img = (seed: number) => `https://picsum.photos/seed/car${seed}/800/600`

export const MOCK_CARS: CarSummary[] = [
  { id: '010845', name: 'EV6 GT-Line 4WD', subtitle: '신차', image: img(1), price: 5990, popularity: 99, specs: { power: '239kW', range: '494km', drive: 'AWD', year: '2025' } },
  { id: '010846', name: 'EV9 GT 6인', subtitle: '신차', image: img(2), price: 8990, popularity: 98, specs: { power: '283kW', range: '501km', drive: 'AWD', year: '2025' } },
  { id: '010847', name: 'EV5 Air', subtitle: '신차', image: img(3), price: 4190, popularity: 92, specs: { power: '160kW', range: '530km', drive: 'FWD', year: '2025' } },
  { id: '010848', name: 'Niro EV', subtitle: '신차', image: img(4), price: 4290, popularity: 90, specs: { power: '150kW', range: '410km', drive: 'FWD', year: '2025' } },
  { id: '010849', name: 'Ray EV', subtitle: '신차', image: img(5), price: 2790, popularity: 85 },
  { id: '010850', name: 'Bongo III EV', subtitle: '신차', image: img(6), price: 4890, popularity: 80 },
]


