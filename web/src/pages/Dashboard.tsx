import { Link } from 'react-router-dom'
import AppShell from '../layout/AppShell'
import Card from '../ui/Card'

export default function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <p className="lead">
        Use the CLI to log work sessions offline, then sync and view analytics here.
      </p>

      <div className="grid">
        <Link to="/sessions" className="cardLink">
          <Card className="cardLink__card">
            <h2 className="h2">Sessions</h2>
            <p className="muted">
              Browse and filter your sessions by project and date.
            </p>
          </Card>
        </Link>

        <Link to="/report" className="cardLink">
          <Card className="cardLink__card">
            <h2 className="h2">Report</h2>
            <p className="muted">
              Summary + charts (cached via Redis) by project and date range.
            </p>
          </Card>
        </Link>
      </div>
    </AppShell>
  )
}
