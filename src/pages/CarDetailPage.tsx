import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCarDetail, type CarDetail } from '../mocks/api/cars'

export function CarDetailPage() {
  const { carId } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState<CarDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      <div className="sticky-cta">
        <div className="panel" style={{ marginBottom: 12 }}>
          <div className="title" style={{ fontSize: 20 }}>{car.name}</div>
          <div className="subtitle" style={{ marginTop: 4 }}>{car.subtitle}</div>
          {/* Price shown per-trim below */}
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
        <div className="panel">
          {car.description}
        </div>
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="title" style={{ fontSize: 18, marginBottom: 8 }}>트림별 가격</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, alignItems: 'center' }}>
            {(car as any).trims?.map((t: any) => (
              <>
                <div>{t.name} {t.bodyType ? `· ${t.bodyType.toUpperCase()}` : ''}</div>
                <div style={{ textAlign: 'right' }}>{t.monthly ? `월 ${t.monthly.toLocaleString()}원` : '-'}</div>
                <div style={{ textAlign: 'right' }}>{t.price ? `${t.price.toLocaleString()}만원` : ''}</div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


