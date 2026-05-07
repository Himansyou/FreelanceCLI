import { useState } from 'react'
import { ProjectDetail } from '../api'

type ProjectExportProps = {
  projectDetail: ProjectDetail
  onExport: () => void
  onCancel: () => void
}

export default function ProjectExport({ projectDetail, onExport, onCancel }: ProjectExportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    try {
      const htmlContent = generateHTML(projectDetail)
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      const safeProjectName = projectDetail.projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      link.setAttribute('download', `${safeProjectName}_report.html`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      onExport()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const generateHTML = (detail: ProjectDetail): string => {
    const totalHours = (detail.totalMinutes / 60).toFixed(2)
    const projectStart = new Date(detail.projectStart).toLocaleDateString()
    const projectEnd = new Date(detail.projectEnd).toLocaleDateString()

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${detail.projectName} - Project Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #333;
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            border: 2px solid #e9ecef;
        }
        .stat-card .label {
            color: #6c757d;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .stat-card .value {
            color: #333;
            font-size: 2em;
            font-weight: 700;
        }
        .stat-card.highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
        }
        .stat-card.highlight .label,
        .stat-card.highlight .value {
            color: white;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .session-table {
            font-size: 0.9em;
        }
        .session-table td {
            vertical-align: top;
        }
        .session-id {
            font-family: monospace;
            color: #667eea;
            font-size: 0.85em;
        }
        .duration {
            font-weight: 600;
            color: #333;
        }
        .earnings {
            color: #28a745;
            font-weight: 600;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
        }
        .footer .logo {
            font-size: 1.5em;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 10px;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${detail.projectName}</h1>
            <div class="subtitle">Project Completion Report</div>
            <div class="subtitle" style="margin-top: 10px; font-size: 0.9em;">
                ${projectStart} - ${projectEnd}
            </div>
        </div>

        <div class="content">
            <!-- Project Overview -->
            <div class="section">
                <h2>Project Overview</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="label">Total Hours</div>
                        <div class="value">${totalHours}h</div>
                    </div>
                    <div class="stat-card">
                        <div class="label">Total Sessions</div>
                        <div class="value">${detail.sessionCount}</div>
                    </div>
                    <div class="stat-card highlight">
                        <div class="label">Total Earnings</div>
                        <div class="value">$${detail.totalEarnings.toFixed(2)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="label">Hourly Rate</div>
                        <div class="value">$${detail.hourlyRate.toFixed(2)}/h</div>
                    </div>
                </div>
            </div>

            <!-- Weekly Summary -->
            <div class="section">
                <h2>Weekly Summary</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Hours</th>
                            <th>Sessions</th>
                            <th>Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detail.weeklySummaries.map(week => `
                            <tr>
                                <td>${new Date(week.weekStart).toLocaleDateString()} - ${new Date(week.weekEnd).toLocaleDateString()}</td>
                                <td>${(week.totalMinutes / 60).toFixed(2)}h</td>
                                <td>${week.sessionCount}</td>
                                <td class="earnings">$${week.earnings.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Detailed Session Log -->
            <div class="section">
                <h2>Detailed Session Log</h2>
                <table class="session-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Session ID</th>
                            <th>Duration</th>
                            <th>Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${detail.sessions.map(session => {
                            const startTime = new Date(session.startTime)
                            const endTime = session.endTime ? new Date(session.endTime) : null
                            const hours = (session.durationMinutes / 60).toFixed(2)
                            return `
                                <tr>
                                    <td>
                                        <div>${startTime.toLocaleDateString()}</div>
                                        <div style="font-size: 0.85em; color: #6c757d;">
                                            ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -
                                            ${endTime ? endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Ongoing'}
                                        </div>
                                    </td>
                                    <td><span class="session-id">${session.sessionId.substring(0, 8)}...</span></td>
                                    <td class="duration">${hours}h</td>
                                    <td class="earnings">$${session.earnings.toFixed(2)}</td>
                                </tr>
                            `
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Financial Summary -->
            <div class="section">
                <h2>Financial Summary</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="label">Rate Type</div>
                        <div class="value" style="font-size: 1.2em;">Project-Specific</div>
                    </div>
                    <div class="stat-card">
                        <div class="label">Billable Hours</div>
                        <div class="value">${totalHours}h</div>
                    </div>
                    <div class="stat-card highlight">
                        <div class="label">Total Due</div>
                        <div class="value">$${detail.totalEarnings.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="logo">FreelanceCLI</div>
            <div>Generated on ${new Date().toLocaleDateString()}</div>
            <div style="margin-top: 10px;">This document serves as proof of work completion</div>
        </div>
    </div>
</body>
</html>`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-container p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-3xl" data-icon="description">description</span>
          <h3 className="text-xl font-bold">Export Project Report</h3>
        </div>
        <p className="text-on-surface-variant mb-6">
          Generate a detailed HTML report for <strong>{projectDetail.projectName}</strong> with weekly summaries and session details.
        </p>
        <div className="bg-surface-container-low p-4 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-on-surface-variant">Total Hours:</span>
              <div className="font-bold text-white">{(projectDetail.totalMinutes / 60).toFixed(2)}h</div>
            </div>
            <div>
              <span className="text-on-surface-variant">Sessions:</span>
              <div className="font-bold text-white">{projectDetail.sessionCount}</div>
            </div>
            <div>
              <span className="text-on-surface-variant">Earnings:</span>
              <div className="font-bold text-primary">${projectDetail.totalEarnings.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-on-surface-variant">Rate:</span>
              <div className="font-bold text-white">${projectDetail.hourlyRate.toFixed(2)}/h</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-surface-variant text-on-surface-variant rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined animate-spin" data-icon="refresh">refresh</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" data-icon="download">download</span>
                Export HTML
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}