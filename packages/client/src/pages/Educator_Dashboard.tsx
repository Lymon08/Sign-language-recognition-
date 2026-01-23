import React, { useEffect, useState } from "react";
import { fetchDashboard, getAllStudents, getSignStatistics } from "../services/api";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/EducatorDashboard.css';

interface DashboardData {
  total_predictions: number;
  usage_by_label: Record<string, number>;
}

interface Student {
  id: string;
  name: string;
  totalAttempts: number;
  correctPredictions: number;
  accuracy: number;
  lastActive: string;
}

interface SignStats {
  sign: string;
  attempts: number;
  successful: number;
  successRate: number;
  averageConfidence: number;
}

export default function EducatorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [signStats, setSignStats] = useState<Record<string, SignStats>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'signs' | 'performance'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [accuracyTrendData, setAccuracyTrendData] = useState<any[]>([]);
  const [difficultyData, setDifficultyData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const SIGNS = ["good", "good_morning", "goodbye", "hello", "help", "meet", "nice", "thankyou"];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch overall dashboard metrics
      const dashRes = await fetchDashboard();
      setDashboardData(dashRes.data);

      // Generate mock student data
      const mockStudents: Student[] = [
        {
          id: 'student_1',
          name: 'Lymon Sithole',
          totalAttempts: 45,
          correctPredictions: 38,
          accuracy: 84.4,
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString()
        },
        {
          id: 'student_2',
          name: 'Brandon Mutewera',
          totalAttempts: 32,
          correctPredictions: 26,
          accuracy: 81.3,
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toLocaleString()
        },
        {
          id: 'student_3',
          name: 'Louis Sithole',
          totalAttempts: 58,
          correctPredictions: 51,
          accuracy: 87.9,
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toLocaleString()
        },
        {
          id: 'student_4',
          name: 'Rodric Ndlovu',
          totalAttempts: 23,
          correctPredictions: 18,
          accuracy: 78.3,
          lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString()
        }
      ];
      setStudents(mockStudents);

      // Generate mock sign statistics
      const mockSignStats: Record<string, SignStats> = {};
      SIGNS.forEach(sign => {
        mockSignStats[sign] = {
          sign: sign,
          attempts: Math.floor(Math.random() * 60) + 20,
          successful: Math.floor(Math.random() * 50) + 10,
          successRate: Math.random() * 0.3 + 0.7,
          averageConfidence: Math.random() * 0.25 + 0.75
        };
      });
      setSignStats(mockSignStats);

      // Generate Weekly Translation Activity data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklyChartData = days.map(day => ({
        day,
        'Active Students': Math.floor(Math.random() * 120) + 50,
        'Translations': Math.floor(Math.random() * 30) + 5
      }));
      setWeeklyData(weeklyChartData);

      // Generate Accuracy Trend data
      const accuracyChartData = days.map((day, idx) => ({
        day,
        'Accuracy %': 75 + Math.random() * 25 + (idx * 2)
      }));
      setAccuracyTrendData(accuracyChartData);

      // Generate Learning Difficulty Distribution data
      setDifficultyData([
        { name: 'Easy', value: 45 },
        { name: 'Medium', value: 35 },
        { name: 'Hard', value: 20 }
      ]);

      // Generate Recent Activity data
      const activityList = [
        { id: 1, name: 'Lymon Sithole', activity: 'Practicing "Help" gesture', status: 'Active Now' },
        { id: 2, name: 'Brandon Mutewera', activity: 'Module 3: Advanced Signs', status: 'Active Now' },
        { id: 3, name: 'Louis Sithole', activity: 'Completed practice session', status: '2h ago' },
        { id: 4, name: 'Rodric Ndlovu', activity: 'Started Module 2', status: '3h ago' }
      ];
      setRecentActivity(activityList);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallAccuracy = students.length > 0
    ? (students.reduce((sum, s) => sum + s.accuracy, 0) / students.length).toFixed(1)
    : '0';

  const totalAttempts = students.reduce((sum, s) => sum + s.totalAttempts, 0);
  const totalCorrect = students.reduce((sum, s) => sum + s.correctPredictions, 0);

  return (
    <div className="educator-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>👨‍🏫 Educator Dashboard</h1>
          <p className="subtitle">Monitor student progress and sign language performance</p>
        </header>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            📈 Performance
          </button>
          <button 
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 Students
          </button>
          <button 
            className={`tab ${activeTab === 'signs' ? 'active' : ''}`}
            onClick={() => setActiveTab('signs')}
          >
            🤚 Sign Performance
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">📈</div>
                    <h3>Total Attempts</h3>
                    <p className="metric-value">{totalAttempts}</p>
                    <p className="metric-subtitle">Across all students</p>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">✓</div>
                    <h3>Successful Predictions</h3>
                    <p className="metric-value">{totalCorrect}</p>
                    <p className="metric-subtitle">{((totalCorrect / totalAttempts) * 100).toFixed(1)}% accuracy</p>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">🎯</div>
                    <h3>Average Accuracy</h3>
                    <p className="metric-value">{overallAccuracy}%</p>
                    <p className="metric-subtitle">Class average</p>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon">👥</div>
                    <h3>Active Students</h3>
                    <p className="metric-value">{students.length}</p>
                    <p className="metric-subtitle">In the program</p>
                  </div>
                </div>

                {dashboardData && (
                  <div className="chart-section">
                    <h2>Sign Language Usage</h2>
                    <div className="sign-usage-grid">
                      {Object.entries(dashboardData.usage_by_label).map(([sign, count]) => (
                        <div key={sign} className="sign-usage-item">
                          <div className="sign-name">{sign}</div>
                          <div className="usage-bar">
                            <div 
                              className="usage-fill"
                              style={{ width: `${(count / Math.max(...Object.values(dashboardData.usage_by_label)) * 100) || 0}%` }}
                            ></div>
                          </div>
                          <div className="usage-count">{count} times</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab - Charts */}
            {activeTab === 'performance' && (
              <div className="tab-content">
                <div className="charts-grid">
                  {/* Weekly Translation Activity */}
                  <div className="chart-card">
                    <h3>Weekly Translation Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Active Students" fill="#667eea" />
                        <Bar dataKey="Translations" fill="#764ba2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Accuracy Trend */}
                  <div className="chart-card">
                    <h3>Accuracy Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={accuracyTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Accuracy %" 
                          stroke="#1abc9c" 
                          strokeWidth={2}
                          dot={{ fill: '#1abc9c', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Learning Difficulty Distribution */}
                  <div className="chart-card">
                    <h3>Learning Difficulty Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <Pie
                          data={difficultyData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#1abc9c" />
                          <Cell fill="#f39c12" />
                          <Cell fill="#e74c3c" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Real-Time Activity */}
                  <div className="chart-card activity-card">
                    <h3>Real-Time Activity</h3>
                    <div className="activity-list">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-content">
                            <div className="activity-name">{activity.name}</div>
                            <div className="activity-description">{activity.activity}</div>
                          </div>
                          <div className={`activity-status ${activity.status === 'Active Now' ? 'active' : ''}`}>
                            {activity.status === 'Active Now' ? (
                              <span className="badge-active">🟢 Active Now</span>
                            ) : (
                              <span className="time-ago">{activity.status}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'students' && (
              <div className="tab-content">
                <div className="students-section">
                  <h2>Student Performance</h2>
                  <div className="students-table-wrapper">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Total Attempts</th>
                          <th>Correct</th>
                          <th>Accuracy</th>
                          <th>Last Active</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id} className={selectedStudent === student.id ? 'selected' : ''}>
                            <td className="student-name">{student.name}</td>
                            <td>{student.totalAttempts}</td>
                            <td>{student.correctPredictions}</td>
                            <td>
                              <div className="accuracy-badge">
                                {student.accuracy.toFixed(1)}%
                              </div>
                            </td>
                            <td className="last-active">{student.lastActive}</td>
                            <td>
                              <button 
                                className="btn-details"
                                onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                              >
                                {selectedStudent === student.id ? 'Hide' : 'Details'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedStudent && (
                    <div className="student-details">
                      <h3>Detailed Performance - {students.find(s => s.id === selectedStudent)?.name}</h3>
                      <div className="detail-grid">
                        {SIGNS.map(sign => (
                          <div key={sign} className="sign-detail-card">
                            <h4>{sign}</h4>
                            <div className="detail-stat">
                              <span>Success Rate:</span>
                              <span className="stat-value">{(Math.random() * 30 + 70).toFixed(1)}%</span>
                            </div>
                            <div className="detail-stat">
                              <span>Attempts:</span>
                              <span className="stat-value">{Math.floor(Math.random() * 10) + 5}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sign Performance Tab */}
            {activeTab === 'signs' && (
              <div className="tab-content">
                <div className="signs-section">
                  <h2>Sign Language Performance</h2>
                  <div className="signs-grid">
                    {Object.values(signStats).map(stat => (
                      <div key={stat.sign} className="sign-card">
                        <h3 className="sign-title">{stat.sign}</h3>
                        <div className="sign-stats">
                          <div className="stat-row">
                            <span className="stat-label">Total Attempts</span>
                            <span className="stat-number">{stat.attempts}</span>
                          </div>
                          <div className="stat-row">
                            <span className="stat-label">Successful</span>
                            <span className="stat-number">{Math.round(stat.attempts * stat.successRate)}</span>
                          </div>
                          <div className="stat-row">
                            <span className="stat-label">Success Rate</span>
                            <span className="stat-percentage">{(stat.successRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="stat-row">
                            <span className="stat-label">Avg Confidence</span>
                            <span className="stat-percentage">{(stat.averageConfidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${stat.successRate * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
