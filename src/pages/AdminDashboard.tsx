import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import styles from './AdminDashboard.module.css';
import { Search, Download, Users, FileText, CheckCircle, Briefcase, Award, X, LayoutGrid } from 'lucide-react';
import Button from '../components/common/Button';

// Types
type TabType = 'all' | 'registrations' | 'delegations' | 'chairboard_apps' | 'admin_apps' | 'press_apps';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [data, setData] = useState<Record<string, any[]>>({
    registrations: [],
    delegations: [],
    chairboard_apps: [],
    admin_apps: [],
    press_apps: []
  });
  const [loading, setLoading] = useState(false);

  // Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem('alacatimun_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use VITE_ADMIN_PASSWORD or fallback
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('alacatimun_admin_session', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('alacatimun_admin_session');
    setPasswordInput('');
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const tabs: Exclude<TabType, 'all'>[] = ['registrations', 'delegations', 'chairboard_apps', 'admin_apps', 'press_apps'];
      const results: any = {};

      for (const tab of tabs) {
        const { data: tableData, error } = await supabase
          .from(tab)
          .select('*');

        if (error) {
          console.error(`Error fetching ${tab}:`, error);
          results[tab] = [];
        } else {
          // Sort in memory to avoid missing column errors
          const sorted = (tableData || []).sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          results[tab] = sorted;
        }
      }

      setData(results);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered data for active tab
  const filteredData = useMemo(() => {
    let currentData: any[] = [];
    if (activeTab === 'all') {
      currentData = [
        ...data.registrations.map(item => ({ ...item, app_type: 'Delegate' })),
        ...data.delegations.map(item => ({ ...item, app_type: 'Delegation' })),
        ...data.chairboard_apps.map(item => ({ ...item, app_type: 'Chairboard' })),
        ...data.admin_apps.map(item => ({ ...item, app_type: 'Admin' })),
        ...data.press_apps.map(item => ({ ...item, app_type: 'Press' }))
      ];
      // Sort mixed data by date
      currentData.sort((a: any, b: any) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      currentData = data[activeTab] || [];
    }

    if (!searchQuery) return currentData;

    const lowerQuery = searchQuery.toLowerCase();
    return currentData.filter((item: any) => {
      const name = (item.full_name || '').toLowerCase();
      const delegation = (item.delegation_name || '').toLowerCase();
      return name.includes(lowerQuery) || delegation.includes(lowerQuery);
    });
  }, [data, activeTab, searchQuery]);

  // Shuttle Aggregate
  const shuttleStats = useMemo(() => {
    const counts: Record<string, number> = {
      'Halkapınar': 0,
      'Karşıyaka': 0,
      'Fahrettin Altay': 0,
      'Torbalı': 0,
      'I will not use a shuttle': 0,
      'Not Answered': 0
    };
    
    // Combine all forms
    const allApps = [
      ...data.registrations,
      ...data.delegations,
      ...data.chairboard_apps,
      ...data.admin_apps,
      ...data.press_apps
    ];

    allApps.forEach(app => {
      // old schema used 'shuttle_wanted' and 'shuttle_from'
      // new schema uses 'shuttle'
      const choice = app.shuttle || (app.shuttle_wanted === 'yes' ? app.shuttle_from : (app.shuttle_wanted === 'no' ? 'I will not use a shuttle' : null));
      
      if (choice && counts[choice] !== undefined) {
        counts[choice]++;
      } else if (choice) {
        // If it's an old value or different string
        counts[choice] = (counts[choice] || 0) + 1;
      } else {
        counts['Not Answered']++;
      }
    });
    
    return counts;
  }, [data]);

  // CSV Export
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    // Get headers from first item
    const headers = Object.keys(filteredData[0]);

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item =>
        headers.map(header => {
          let val = item[header];
          if (val === null || val === undefined) val = '';
          // Escape quotes and wrap in quotes to handle commas in text
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Admin Login</h1>
            <form onSubmit={handleLogin} className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label className={styles.detailLabel} style={{ marginBottom: '8px' }}>Passcode</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={styles.input}
                  placeholder="Enter admin passcode"
                  autoFocus
                />
              </div>
              {authError && <div className={styles.authError}>{authError}</div>}
              <Button type="submit" variant="primary" fullWidth style={{ marginTop: '8px' }}>
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Delegate': return '#aa3bff';
      case 'Delegation': return '#3b82f6';
      case 'Chairboard': return '#eab308';
      case 'Admin': return '#10b981';
      case 'Press': return '#f43f5e';
      default: return '#6b7280';
    }
  };

  // Define table columns based on active tab
  const renderTableHeader = () => {
    switch (activeTab) {
      case 'all':
        return (
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>School</th>
            <th>Email</th>
            <th>Date</th>
          </tr>
        );
      case 'registrations':
      case 'chairboard_apps':
      case 'admin_apps':
      case 'press_apps':
        return (
          <tr>
            <th>Name</th>
            <th>School</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
          </tr>
        );
      case 'delegations':
        return (
          <tr>
            <th>Delegation / Advisor</th>
            <th>School</th>
            <th>Expected Members</th>
            <th>Email</th>
            <th>Date</th>
          </tr>
        );
    }
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'all':
        return (
          <tr key={`${item.app_type}-${item.id}`} onClick={() => setSelectedItem(item)}>
            <td>
              <span style={{
                background: getBadgeColor(item.app_type),
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {item.app_type}
              </span>
            </td>
            <td style={{ fontWeight: 500 }}>
              {item.app_type === 'Delegation' ? item.delegation_name : item.full_name}
              {item.app_type === 'Delegation' && (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.full_name} (Advisor)</div>
              )}
            </td>
            <td>{item.school}</td>
            <td>{item.email}</td>
            <td className={styles.dateText}>{formatDate(item.created_at)}</td>
          </tr>
        );
      case 'registrations':
      case 'chairboard_apps':
      case 'admin_apps':
      case 'press_apps':
        return (
          <tr key={item.id} onClick={() => setSelectedItem(item)}>
            <td style={{ fontWeight: 500 }}>{item.full_name}</td>
            <td>{item.school}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td className={styles.dateText}>{formatDate(item.created_at)}</td>
          </tr>
        );
      case 'delegations':
        return (
          <tr key={item.id} onClick={() => setSelectedItem(item)}>
            <td>
              <div style={{ fontWeight: 500 }}>{item.delegation_name}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.full_name} (Advisor)</div>
            </td>
            <td>{item.school}</td>
            <td>{item.expected_members}</td>
            <td>{item.email}</td>
            <td className={styles.dateText}>{formatDate(item.created_at)}</td>
          </tr>
        );
    }
  };

  const tabs = [
    { id: 'all', label: 'All', icon: <LayoutGrid size={18} /> },
    { id: 'registrations', label: 'Delegates', icon: <Users size={18} /> },
    { id: 'delegations', label: 'Delegations', icon: <Briefcase size={18} /> },
    { id: 'chairboard_apps', label: 'Chairboard', icon: <Award size={18} /> },
    { id: 'admin_apps', label: 'Admin', icon: <CheckCircle size={18} /> },
    { id: 'press_apps', label: 'Press', icon: <FileText size={18} /> },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`${styles.metricCard} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setSearchQuery('');
            }}
          >
            <div className={styles.metricIcon}>{tab.icon}</div>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>
                {loading ? '...' : tab.id === 'all'
                  ? Object.values(data).reduce((acc, curr) => acc + curr.length, 0)
                  : data[tab.id]?.length || 0}
              </span>
              <span className={styles.metricLabel}>{tab.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shuttle Stats */}
      <div className={styles.metricsGrid} style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <div style={{ width: '100%', gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>Shuttle Statistics (Overall)</h3>
        </div>
        {Object.entries(shuttleStats).map(([station, count]) => (
          <div key={station} className={styles.metricCard} style={{ cursor: 'default' }}>
            <div className={styles.metricContent}>
              <span className={styles.metricValue}>{count}</span>
              <span className={styles.metricLabel}>{station}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setSearchQuery('');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {tab.icon} {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actionsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className={styles.exportButton} onClick={exportToCSV}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              {renderTableHeader()}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={styles.noData}>Loading data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    {searchQuery ? 'No results found.' : 'No applications yet.'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item: any) => renderTableRow(item))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <div className={`${styles.modalOverlay} ${selectedItem ? styles.open : ''}`} onClick={() => setSelectedItem(null)}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          {selectedItem && (
            <>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Application Details</h2>
                <button className={styles.closeButton} onClick={() => setSelectedItem(null)}>
                  <X size={24} />
                </button>
              </div>
              <div className={styles.modalBody}>

                {/* Basic Info */}
                <div className={styles.detailCard}>
                  <div className={styles.twoCols}>
                    <div className={styles.detailGroup}>
                      <span className={styles.detailLabel}>Full Name</span>
                      <span className={styles.detailValue} style={{ fontWeight: 600 }}>{selectedItem.full_name}</span>
                    </div>
                    <div className={styles.detailGroup}>
                      <span className={styles.detailLabel}>Date</span>
                      <span className={styles.detailValue}>{formatDate(selectedItem.created_at)}</span>
                    </div>
                    <div className={styles.detailGroup}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>
                        <a href={`mailto:${selectedItem.email}`} style={{ color: 'var(--accent)' }}>{selectedItem.email}</a>
                      </span>
                    </div>
                    <div className={styles.detailGroup}>
                      <span className={styles.detailLabel}>Phone</span>
                      <span className={styles.detailValue}>
                        <a href={`tel:${selectedItem.phone}`} style={{ color: 'var(--accent)' }}>{selectedItem.phone}</a>
                      </span>
                    </div>
                    <div className={styles.detailGroup}>
                      <span className={styles.detailLabel}>School</span>
                      <span className={styles.detailValue}>{selectedItem.school}</span>
                    </div>
                    {selectedItem.grade && (
                      <div className={styles.detailGroup}>
                        <span className={styles.detailLabel}>Grade</span>
                        <span className={styles.detailValue}>{selectedItem.grade}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specific Fields */}
                {Object.entries(selectedItem).map(([key, value]) => {
                  // Skip basic fields we already rendered
                  if (['id', 'created_at', 'full_name', 'email', 'phone', 'school', 'grade'].includes(key)) return null;
                  if (value === null || value === '') return null;

                  // Custom labels for long questions
                  const customLabels: Record<string, string> = {
                    q_ai_suspicion: 'Q: Delegate AI Suspicion',
                    q_final_documents: 'Q: Final Documents',
                    q_directive_help: 'Q: Directive Help (Crisis)',
                    q_resolution_paper: 'Q: Resolution Paper (GA)',
                    q_disagreement: 'Q: Chairboard Disagreement',
                    app_type: 'Application Type',
                    shuttle: 'Q: Shuttle Choice',
                    accommodation: 'Q: Will use accommodation?'
                  };

                  // Format keys
                  const formattedKey = customLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <div key={key} className={styles.detailGroup}>
                      <span className={styles.detailLabel}>{formattedKey}</span>
                      <span className={styles.detailValue} style={{ whiteSpace: 'pre-wrap' }}>{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
