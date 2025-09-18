export type CarSummary = {
  id: string
  name: string
  subtitle?: string
  image: string
  popularity?: number
  brand?: string
  tags?: string[]
  // Aggregated fields for list view (computed from trims on server)
  monthlyMin?: number
}

export type Trim = {
  name: string
  bodyType?: 'compact' | 'mid' | 'large' | 'suv' | 'cargo'
  // 구매가(만원 단위) 또는 월 납입금(원 단위)
  price?: number
  monthly?: number
}

export type CarDetail = CarSummary & {
  images: string[]
  specs: { power?: string; range?: string; drive?: string; year?: string }
  description?: string
  trims: Trim[]
}
const base = ''

export async function fetchCars(params: { q?: string; sort?: string; brand?: string; price?: string[]; type?: string[]; fuel?: string[] }) {
  const usp = new URLSearchParams()
  if (params.q) usp.set('q', params.q)
  if (params.sort) usp.set('sort', params.sort)
  if (params.brand) usp.set('brand', params.brand)
  if (params.price && params.price.length) usp.set('price', params.price.join(','))
  if (params.type && params.type.length) usp.set('type', params.type.join(','))
  if (params.fuel && params.fuel.length) usp.set('fuel', params.fuel.join(','))
  const res = await fetch(`${base}/api/cars?${usp.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch cars')
  const data = await res.json() as { items: CarSummary[] }
  return data.items
}

export async function fetchCarDetail(id: string) {
  const res = await fetch(`${base}/api/cars/${id}`)
  if (!res.ok) throw new Error('Not found')
  const data = await res.json() as CarDetail
  return data
}

export async function fetchBrands() {
  const res = await fetch(`${base}/api/brands`)
  if (!res.ok) return [] as string[]
  const data = await res.json() as { items: string[] }
  return data.items
}


