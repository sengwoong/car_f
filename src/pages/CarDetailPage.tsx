import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCarDetail, type CarDetail } from '../mocks/api/cars'

export function CarDetailPage() {
  const { carId } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState<CarDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- Sales data from backend (/sales/list) ---
  type SalesItem = { id: number; code?: string | null; name: string; price_delta?: number | null }
  type SalesGroup = { id?: number; group_id?: number; trim_group_id?: number; name: string; multi_select: boolean; items: SalesItem[] }
  type SalesTrim = { id: number; name: string; base_price?: number | null; option_groups?: SalesGroup[]; options?: { item_id: number; group?: string; item?: string; is_default?: boolean }[] }
  type SalesModel = { id: number; model_name: string; option_groups: SalesGroup[]; trims: SalesTrim[] }

  const [sales, setSales] = useState<SalesModel | null>(null)
  const [selectedTrimId, setSelectedTrimId] = useState<number | null>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!carId) return
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCarDetail(carId)
        if (!ignore) setCar(data)
      } catch (e) {
        if (!ignore) setError('차량 정보를 불러오지 못했습니다')
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [carId])

  // Fetch sales list for this model name once car is loaded
  useEffect(() => {
    if (!car?.name) return
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`/sales/list?model_name=${encodeURIComponent(car.name)}`)
        if (!res.ok) return
        const data = await res.json() as { ok: boolean; models: SalesModel[] }
        const model = data.models?.[0]
        if (!model || ignore) return
        setSales(model)
        const firstTrim = model.trims?.[0]
        if (firstTrim) {
          setSelectedTrimId(firstTrim.id)
          const defaults = new Set<number>()
          ;(firstTrim.options || []).forEach(o => { if (o && typeof o.item_id === 'number') defaults.add(o.item_id) })
          setSelectedItemIds(defaults)
        }
      } catch {}
    })()
    return () => { ignore = true }
  }, [car?.name])

  // Utilities
  function formatWon(n: number | null | undefined) {
    const v = typeof n === 'number' ? n : 0
    return `${v.toLocaleString('ko-KR')}원`
  }

  const currentTrim = sales?.trims?.find(t => t.id === selectedTrimId) || null
  const groups: SalesGroup[] = [
    ...((sales?.option_groups ?? [])),
    ...((currentTrim?.option_groups ?? [])),
  ]

  const itemPriceMap: Map<number, number> = new Map()
  groups.forEach(g => g.items?.forEach(it => itemPriceMap.set(it.id, (it.price_delta ?? 0) as number)))
  const basePrice = currentTrim?.base_price ? Number(currentTrim.base_price) : 0
  const optionsTotal = Array.from(selectedItemIds).reduce((acc, id) => acc + (itemPriceMap.get(id) || 0), 0)
  const totalPrice = basePrice + optionsTotal

  // Selected option details for price breakdown
  const selectedItems = groups
    .flatMap(g => (g.items || [])
      .filter(it => selectedItemIds.has(it.id))
      .map(it => ({ id: it.id, name: it.name, price: Number(it.price_delta || 0) })))

  function toggleItem(group: SalesGroup, itemId: number) {
    setSelectedItemIds(prev => {
      const next = new Set(prev)
      if (group.multi_select) {
        if (next.has(itemId)) next.delete(itemId)
        else next.add(itemId)
      } else {
        // radio behavior: clear items in this group, then add
        for (const it of group.items) next.delete(it.id)
        next.add(itemId)
      }
      return next
    })
  }

  if (loading) {
    return <div className="panel">불러오는 중…</div>
  }

  if (error) {
    return (
      <div className="panel">
        {error}
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={()=>navigate('/')}>목록으로</button>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="panel">
        존재하지 않는 차량입니다.
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={()=>navigate('/')}>목록으로</button>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-layout">
      <div className="gallery">
        <img src={car.images?.[0]} alt={car.name} style={{ width: '100%', display: 'block' }} />
      </div>
      <div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <div className="title" style={{ fontSize: 20 }}>{car.name}</div>
          <div className="subtitle" style={{ marginTop: 4 }}>{car.subtitle}</div>
          {sales && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 600 }}>
              <div>총 가격</div>
              <div>{formatWon(totalPrice)}</div>
            </div>
          )}
          {sales && (
            <div style={{ marginTop: 8, color: '#555' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>가격 계산</div>
              <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                {[
                  formatWon(basePrice),
                  ...selectedItems.map(si => formatWon(si.price)),
                ].join(' + ')}
                {` = ${formatWon(totalPrice)}`}
              </div>
              <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: '1fr auto', gap: 6 }}>
                <div>{currentTrim?.name} 기본가</div>
                <div style={{ textAlign: 'right' }}>{formatWon(basePrice)}</div>
                {selectedItems.map(si => (
                  <>
                    <div key={`name-${si.id}`}>+ {si.name}</div>
                    <div key={`price-${si.id}`} style={{ textAlign: 'right' }}>{formatWon(si.price)}</div>
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="panel">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>전비/출력</div><div style={{ textAlign: 'right' }}>{car.specs?.power}</div>
            <div>주행거리</div><div style={{ textAlign: 'right' }}>{car.specs?.range}</div>
            <div>구동</div><div style={{ textAlign: 'right' }}>{car.specs?.drive}</div>
            <div>연식</div><div style={{ textAlign: 'right' }}>{car.specs?.year}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn-primary">상담/견적 요청</button>
          </div>
        </div>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <div className="panel">{car.description}</div>

        {/* Trim selector */}
        {sales && (
          <div className="panel" style={{ marginTop: 12 }}>
            <div className="title" style={{ fontSize: 18, marginBottom: 8 }}>트림 선택</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
              {sales.trims.map(t => (
                <label key={t.id} style={{ display: 'contents' }}>
                  <div>
                    <input
                      type="radio"
                      name="trim"
                      checked={selectedTrimId === t.id}
                      onChange={() => {
                        setSelectedTrimId(t.id)
                        const defaults = new Set<number>()
                        ;(t.options || []).forEach(o => { if (o && typeof o.item_id === 'number') defaults.add(o.item_id) })
                        setSelectedItemIds(defaults)
                      }}
                      style={{ marginRight: 8 }}
                    />
                    {t.name}
                  </div>
                  <div style={{ textAlign: 'right' }}>{formatWon(t.base_price ?? 0)}</div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        {sales && groups.length > 0 && (
          <div className="panel" style={{ marginTop: 12 }}>
            <div className="title" style={{ fontSize: 18, marginBottom: 8 }}>옵션 선택</div>
            <div style={{ display: 'grid', gap: 16 }}>
              {groups.map((g, gi) => (
                <div key={(g.trim_group_id || g.group_id || g.id || gi)}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {g.name} {g.multi_select ? '' : '(단일 선택)'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, alignItems: 'center' }}>
                    {g.items.map(it => {
                      const checked = selectedItemIds.has(it.id)
                      return (
                        <label key={it.id} style={{ display: 'contents' }}>
                          <div>
                            <input
                              type={g.multi_select ? 'checkbox' : 'radio'}
                              name={`group-${g.trim_group_id || g.group_id || g.id || gi}`}
                              checked={checked}
                              onChange={() => toggleItem(g, it.id)}
                              style={{ marginRight: 8 }}
                            />
                            {it.name}
                          </div>
                          <div style={{ textAlign: 'right' }}>{formatWon((it.price_delta ?? 0) as number)}</div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


