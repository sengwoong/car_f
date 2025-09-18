import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchBrands, fetchCars, type CarSummary } from '../mocks/api/cars'

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') ?? '2' // 2 = popular (mimic ?sort=2)
  const brand = params.get('brand') ?? ''
  const price = (params.get('price') ?? '').split(',').filter(Boolean)
  const type = (params.get('type') ?? '').split(',').filter(Boolean)
  const fuel = (params.get('fuel') ?? '').split(',').filter(Boolean)
  const q = params.get('q') ?? ''

  const [items, setItems] = useState<CarSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const list = await fetchCars({ q: q || undefined, sort, brand: brand || undefined, price, type, fuel })
        if (!ignore) setItems(list)
      } catch (e) {
        if (!ignore) setError('목록을 불러오지 못했습니다')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [q, sort, brand, price.join(','), type.join(','), fuel.join(',')])

  const [brands, setBrands] = useState<string[]>([])
  useEffect(() => {
    let ignore = false
    ;(async () => {
      const list = await fetchBrands()
      if (!ignore) setBrands(list)
    })()
    return () => { ignore = true }
  }, [])

  function updateParam(key: string, value?: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function toggleMulti(key: 'price' | 'type' | 'fuel', token: string) {
    const next = new URLSearchParams(params)
    const current = (next.get(key) ?? '').split(',').filter(Boolean)
    const idx = current.indexOf(token)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(token)
    if (current.length) next.set(key, current.join(','))
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>제조사</h3>
        <div className="brand-list">
          {brands.map(b => (
            <button
              key={b}
              className={`brand-chip ${brand===b ? 'active' : ''}`}
              onClick={() => updateParam('brand', brand === b ? undefined : b)}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <h3>가격</h3>
          <div className="filter-row">
            {[
              { k: '', label: '전체' },
              { k: 'under20m', label: '2천만 원 이하' },
              { k: '20-30m', label: '2천~3천만 원' },
              { k: '30-40m', label: '3천~4천만 원' },
              { k: '40-50m', label: '4천~5천만 원' },
              { k: '50-60m', label: '5천~6천만 원' },
              { k: '60-80m', label: '6천~8천만 원' },
              { k: 'over80m', label: '8천만 원 이상' },
            ].map((p, idx) => (
              <button key={p.k + idx} className={`filter-chip ${(p.k ? price.includes(p.k) : price.length===0) ? 'active' : ''}`} onClick={()=> p.k ? toggleMulti('price', p.k) : updateParam('price', undefined)}>{p.label}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>차량 종류</h3>
          <div className="filter-row">
            {[
              { k: '', label: '전체' },
              { k: 'compact', label: '경·소형승용' },
              { k: 'mid', label: '중형승용' },
              { k: 'suv', label: 'SUV·RV' },
              { k: 'cargo', label: '화물·승합' },
            ].map((p, idx) => (
              <button key={p.k + idx} className={`filter-chip ${(p.k ? type.includes(p.k) : type.length===0) ? 'active' : ''}`} onClick={()=> p.k ? toggleMulti('type', p.k) : updateParam('type', undefined)}>{p.label}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>연료</h3>
          <div className="filter-row">
            {[
              { k: '', label: '전체' },
              { k: 'gasoline', label: '가솔린' },
              { k: 'diesel', label: '디젤' },
              { k: 'lpg', label: 'LPG' },
              { k: 'hybrid', label: '하이브리드' },
              { k: 'ev', label: '전기·수소' },
            ].map((p, idx) => (
              <button key={p.k + idx} className={`filter-chip ${(p.k ? fuel.includes(p.k) : fuel.length===0) ? 'active' : ''}`} onClick={()=> p.k ? toggleMulti('fuel', p.k) : updateParam('fuel', undefined)}>{p.label}</button>
            ))}
          </div>
        </div>
      </aside>
      <section>
        <div className="hero" style={{ marginBottom: 16 }}>
          <img src="https://picsum.photos/seed/hero/1200/200" alt="hero" />
        </div>
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <select className="select" value={sort} onChange={(e)=>updateParam('sort', e.target.value)}>
            <option value="2">인기순</option>
            <option value="1">낮은가격순</option>
            <option value="3">높은가격순</option>
          </select>
        </div>
        {loading && <div className="panel">불러오는 중…</div>}
        {error && <div className="panel">{error}</div>}
        <div className="grid" style={{ gap: 28 }}>
          {items.map(car => (
            <Link key={car.id} to={`/detail/${car.id}`} className="card">
              <div className="card-media">
                <div className="card-brand">{car.brand}</div>
                <img className="card-img" src={car.image} alt={car.name} />
              </div>
              <div className="card-body">
                <div className="title">{car.name}</div>
                <div className="info">{(car as any).fuel ? `${String((car as any).fuel).toUpperCase()} · ` : ''}72개월· 10,000km</div>
                <div className="price">{car.monthlyMin ? `${Math.round((car.monthlyMin||0)/10000).toLocaleString()}만원~` : ''}</div>
                <div className="badges">
                  {car.tags?.map(t => <span key={t} className={`badge ${t==='NEW' ? 'primary' : ''}`}>{t}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}


