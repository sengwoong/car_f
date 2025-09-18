import { http, HttpResponse } from 'msw'

type Trim = {
  name: string
  bodyType?: 'compact' | 'mid' | 'large' | 'suv' | 'cargo'
  price?: number // 만원 단위(선택)
  monthly?: number // 원 단위(선택)
}

type Car = {
  id: string
  name: string
  subtitle?: string
  image: string
  popularity?: number
  brand?: string
  tags?: string[]
  fuel?: 'gasoline' | 'diesel' | 'lpg' | 'hybrid' | 'ev'
  trims: Trim[]
}

const img = (seed: number) => `https://picsum.photos/seed/car${seed}/800/600`

const CARS: Car[] = [
  {
    id: '010845', brand: '기아', name: 'EV6 GT-Line 4WD', subtitle: '신차', image: img(1), popularity: 99, tags: ['인기'], fuel: 'ev',
    trims: [
      { name: 'Air', bodyType: 'suv', monthly: 430000 },
      { name: 'GT-Line 4WD', bodyType: 'suv', monthly: 463650 },
      { name: 'GT', bodyType: 'suv', monthly: 680000 }
    ]
  },
  {
    id: '010846', brand: '기아', name: 'EV9 GT 6인', subtitle: '신차', image: img(2), popularity: 98, tags: ['인기'], fuel: 'ev',
    trims: [
      { name: 'Light', bodyType: 'suv', monthly: 498000 },
      { name: 'Earth', bodyType: 'suv', monthly: 521840 },
      { name: 'GT', bodyType: 'suv', monthly: 820000 }
    ]
  },
  {
    id: '010847', brand: '기아', name: 'EV5 Air', subtitle: '신차', image: img(3), popularity: 92, tags: ['NEW'], fuel: 'ev',
    trims: [
      { name: 'Air', bodyType: 'suv', monthly: 420000 },
      { name: 'Long Range', bodyType: 'suv', monthly: 470000 }
    ]
  },
  {
    id: '010848', brand: '기아', name: 'Niro EV', subtitle: '신차', image: img(4), popularity: 90, fuel: 'ev',
    trims: [
      { name: 'Air', bodyType: 'suv', monthly: 430000 },
      { name: 'Earth', bodyType: 'suv', monthly: 463650 },
      { name: 'Gravity', bodyType: 'suv', monthly: 520000 }
    ]
  },
  {
    id: '010849', brand: '기아', name: 'Ray EV', subtitle: '신차', image: img(5), popularity: 85, fuel: 'ev',
    trims: [
      { name: 'Standard', bodyType: 'compact', monthly: 290000 },
      { name: 'Top', bodyType: 'compact', monthly: 520000 }
    ]
  },
  { id: '010850', brand: '기아', name: 'Bongo III EV', subtitle: '신차', image: img(6), popularity: 80, fuel: 'ev', trims: [ { name: 'Standard', bodyType: 'cargo', monthly: 674630 } ] },
  { id: '020101', brand: '현대', name: '아이오닉 6 롱레인지', subtitle: '신차', image: img(7), popularity: 94, fuel: 'ev', trims: [ { name: 'Long Range', bodyType: 'mid', monthly: 498000 } ] },
  { id: '020102', brand: '현대', name: '아이오닉 5 4WD', subtitle: '신차', image: img(8), popularity: 93, fuel: 'ev', trims: [ { name: '4WD', bodyType: 'suv', monthly: 472000 } ] },
  { id: '030201', brand: '제네시스', name: 'GV60 퍼포먼스', subtitle: '신차', image: img(9), popularity: 88, fuel: 'ev', trims: [ { name: '퍼포먼스', bodyType: 'suv', monthly: 635000 } ] },
  { id: '040301', brand: '테슬라', name: '모델 3 롱레인지', subtitle: '신차', image: img(10), popularity: 96, tags: ['NEW'], fuel: 'ev', trims: [ { name: 'Long Range', bodyType: 'mid', monthly: 697070 } ] },
  { id: '040302', brand: '테슬라', name: '모델 Y 롱레인지', subtitle: '신차', image: img(11), popularity: 97, fuel: 'ev', trims: [ { name: 'Long Range', bodyType: 'suv', monthly: 674630 } ] },
  { id: '050401', brand: '볼보', name: 'EX30', subtitle: '신차', image: img(12), popularity: 86, fuel: 'ev', trims: [ { name: 'Core', bodyType: 'compact', monthly: 489000 } ] },
  // 추가: 컴팩트 세단, 50~70만원 구간 매칭
  { id: '060101', brand: '현대', name: '아반떼 하이브리드', subtitle: '신차', image: img(13), popularity: 91, fuel: 'hybrid', tags: ['인기'], trims: [ { name: 'Smart', bodyType: 'compact', monthly: 552000 } ] },
  { id: '060102', brand: '기아', name: 'K3 하이브리드', subtitle: '신차', image: img(14), popularity: 87, fuel: 'hybrid', trims: [ { name: '트렌디', bodyType: 'compact', monthly: 521840 } ] },
  { id: '060103', brand: '현대', name: '그랜저 GN7 하이브리드', subtitle: '신차', image: img(15), popularity: 90, fuel: 'hybrid', trims: [ { name: '프리미엄', bodyType: 'mid', monthly: 521840 } ] },
]

const BRANDS = ['현대','기아','제네시스','테슬라','BMW','벤츠','볼보','아우디','폭스바겐','렉서스','도요타','포드']

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ ok: true })),
  http.get('/api/brands', () => HttpResponse.json({ items: BRANDS })),
  http.get('/api/cars', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').toLowerCase()
    const sort = url.searchParams.get('sort') ?? '2'
    const brand = url.searchParams.get('brand') ?? ''
    const price = (url.searchParams.get('price') ?? '').split(',').filter(Boolean) // multi
    const body = (url.searchParams.get('type') ?? '').split(',').filter(Boolean)
    const fuel = (url.searchParams.get('fuel') ?? '').split(',').filter(Boolean)
    let list = CARS
    if (q) list = list.filter(i => (i.name + ' ' + (i.subtitle ?? '')).toLowerCase().includes(q))
    if (brand) list = list.filter(i => i.brand === brand)
    if (price.length) {
      const inRange = (m: number, token: string) => (
        (token === 'under50' && m > 0 && m <= 500000) ||
        (token === '50-70' && m > 500000 && m <= 700000) ||
        (token === '70-100' && m > 700000 && m <= 1000000) ||
        (token === 'over100' && m > 1000000)
      )
      list = list.filter(i => {
        const candidates: number[] = i.trims.map(t => t.monthly ?? 0).filter(Boolean)
        if (candidates.length === 0) return false
        return price.some(p => candidates.some(m => inRange(m, p)))
      })
    }
    if (body.length) list = list.filter(i => i.trims.some(t => t.bodyType && body.includes(String(t.bodyType))))
    if (fuel.length) list = list.filter(i => fuel.includes(String(i.fuel)))

    // Build summarized list with aggregated min prices for list view
    const summarized = list.map(i => {
      const monthlyValues = i.trims.map(t => t.monthly ?? 0).filter(Boolean)
      const monthlyMin = monthlyValues.length ? Math.min(...monthlyValues) : undefined
      return {
        id: i.id,
        name: i.name,
        subtitle: i.subtitle,
        image: i.image,
        popularity: i.popularity,
        brand: i.brand,
        tags: i.tags,
        monthlyMin,
      }
    })

    switch (sort) {
      case '1':
        summarized.sort((a,b)=> (a.monthlyMin ?? Number.POSITIVE_INFINITY) - (b.monthlyMin ?? Number.POSITIVE_INFINITY));
        break
      case '2':
        summarized.sort((a,b)=> (b.popularity ?? 0) - (a.popularity ?? 0));
        break
      case '3':
        summarized.sort((a,b)=> (b.monthlyMin ?? 0) - (a.monthlyMin ?? 0));
        break
    }
    return HttpResponse.json({ items: summarized })
  }),

  http.get('/api/cars/:id', ({ params }) => {
    const id = String(params.id)
    const found = CARS.find(c => c.id === id)
    if (!found) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({
      ...found,
      images: [found.image, img(Number(id.slice(-2)) + 20), img(Number(id.slice(-2)) + 40)],
      specs: { power: '239kW', range: '494km', drive: 'AWD', year: '2025' },
      description: '견적/계약은 예시입니다. 실제와 다를 수 있습니다.'
    })
  })
]


