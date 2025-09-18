import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom'

export function AppLayout() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = String(formData.get('q') || '')
    const next = new URLSearchParams(params)
    if (query) next.set('q', query)
    else next.delete('q')
    navigate({ pathname: '/', search: next.toString() })
  }

  return (
    <div>
      <header className="header">
        <div className="header-inner container">
          <Link to="/" className="brand">원더굿라이프</Link>
          <form className="search-bar" onSubmit={handleSearchSubmit} style={{ maxWidth: 680 }}>
            <input name="q" defaultValue={q} className="search-input" placeholder="모델, 키워드 검색" />
            <button className="search-button" type="submit" style={{ minWidth: 72 }}>검색</button>
          </form>
        </div>
      </header>
      <main className="container content">
        <Outlet />
      </main>
      <footer className="container" style={{ padding: 16, color: '#64748b' }}>
        © 2025 demo only.
      </footer>
    </div>
  )
}


