"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Create a data client
const dataClient = generateClient<Schema>();

export default function VisualizationPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;
  
  const [visualizationType, setVisualizationType] = useState<Schema["VisualizationType"]["type"] | null>(null);
  const [userSettings, setUserSettings] = useState<Schema["VisualizationSetting"]["type"] | null>(null);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configName, setConfigName] = useState("My Configuration");
  const [savedMessage, setSavedMessage] = useState("");

  // Fetch visualization type and user settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch visualization type
        const { data: typeData } = await dataClient.models.VisualizationType.get({
          id
        });
        
        if (typeData) {
          setVisualizationType(typeData);
          
          // Parse default config
          const defaultConfig = typeData.defaultConfig ? JSON.parse(typeData.defaultConfig) : {};
          
          // If user is authenticated or a guest with sessionId
          if (user) {
            try {
              // Construct filter based on user type
              const filter = user.isGuest
                ? { 
                    sessionId: { eq: user.sessionId },
                    visualizationTypeID: { eq: id }
                  }
                : { 
                    userProfileID: { eq: user.profile?.id },
                    visualizationTypeID: { eq: id }
                  };
                
              // Fetch user settings
              const { data: settingsData } = await dataClient.models.VisualizationSetting.list({
                filter,
                limit: 1
              });
              
              if (settingsData && settingsData.length > 0) {
                setUserSettings(settingsData[0]);
                // Use saved config
                const savedConfig = JSON.parse(settingsData[0].config);
                setConfig(savedConfig);
                setConfigName(settingsData[0].name);
              } else {
                // Use default config
                setConfig(defaultConfig);
              }
            } catch (error) {
              console.error("Error fetching user settings:", error);
              setConfig(defaultConfig);
            }
          } else {
            // Use default config for non-authenticated users
            setConfig(defaultConfig);
          }
        } else {
          // Handle visualization type not found
          console.error("Visualization type not found");
        }
      } catch (error) {
        console.error("Error fetching visualization data:", error);
        // For demo purposes, set dummy data if no type exists yet
        setVisualizationType({
          id,
          name: id.includes("sports") ? "Sports Dashboard" : 
                id.includes("financial") ? "Financial Markets" : "Weather Dashboard",
          description: "Real-time data visualization",
          dataSourceType: "API",
          dataSourceConfig: JSON.stringify({
            endpoint: "https://api.example.com"
          }),
          defaultConfig: JSON.stringify({
            refreshInterval: 60,
            showChart: true,
            chartType: "line"
          })
        });
        
        setConfig({
          refreshInterval: 60,
          showChart: true,
          chartType: "line"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user]);

  // Save user configuration
  const saveConfiguration = async () => {
    if (!user || !visualizationType) return;
    
    setSaving(true);
    try {
      const configData = {
        config: JSON.stringify(config),
        name: configName,
        visualizationTypeID: visualizationType.id,
        lastViewed: new Date().toISOString()
      };
      
      // Add user-specific fields
      if (user.isGuest) {
        // For guest users, store with sessionId
        Object.assign(configData, {
          sessionId: user.sessionId
        });
      } else if (user.profile) {
        // For authenticated users, link to their profile
        Object.assign(configData, {
          userProfileID: user.profile.id
        });
      }
      
      if (userSettings) {
        // Update existing settings
        await dataClient.models.VisualizationSetting.update({
          id: userSettings.id,
          ...configData
        });
      } else {
        // Create new settings
        await dataClient.models.VisualizationSetting.create({
          id: uuidv4(),
          ...configData
        });
      }
      
      setSavedMessage("Configuration saved successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Error saving configuration:", error);
      setSavedMessage("Failed to save configuration. Please try again.");
      setTimeout(() => setSavedMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Update config value
  const updateConfig = (key: string, value: any) => {
    setConfig({
      ...config,
      [key]: value
    });
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading visualization...</p>
      </div>
    );
  }

  if (!visualizationType) {
    return (
      <main className="main-container">
        <Navigation />
        <div className="visualization-error">
          <h2>Visualization Not Found</h2>
          <p>The requested visualization could not be found.</p>
          <Link href="/visualizations" className="back-btn">
            Back to Visualizations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="main-container">
      <Navigation />

      <div className="visualization-header">
        <div className="visualization-title">
          <h1>{visualizationType.name}</h1>
          <p>{visualizationType.description}</p>
        </div>
        <div className="visualization-actions">
          <Link href="/visualizations" className="back-btn">
            ← Back to Visualizations
          </Link>
        </div>
      </div>

      <div className="visualization-layout">
        <div className="visualization-display">
          <div className="visualization-placeholder">
            {/* This would be replaced with actual visualization components */}
            <div className="visualization-demo">
              <h3>Visualization Preview</h3>
              <p>Data source: {visualizationType.dataSourceType}</p>
              <div className="demo-chart">
                {config.chartType === "line" && (
                  <div className="line-chart-demo">
                    <div className="chart-line" style={{ height: '40%' }}></div>
                    <div className="chart-line" style={{ height: '70%' }}></div>
                    <div className="chart-line" style={{ height: '50%' }}></div>
                    <div className="chart-line" style={{ height: '80%' }}></div>
                    <div className="chart-line" style={{ height: '60%' }}></div>
                  </div>
                )}
                {config.chartType === "bar" && (
                  <div className="bar-chart-demo">
                    <div className="chart-bar" style={{ height: '40%' }}></div>
                    <div className="chart-bar" style={{ height: '70%' }}></div>
                    <div className="chart-bar" style={{ height: '50%' }}></div>
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                  </div>
                )}
                {config.chartType === "pie" && (
                  <div className="pie-chart-demo">
                    <div className="pie-segment" style={{ transform: 'rotate(0deg)', backgroundColor: '#0070f3' }}></div>
                    <div className="pie-segment" style={{ transform: 'rotate(126deg)', backgroundColor: '#2ecc71' }}></div>
                    <div className="pie-segment" style={{ transform: 'rotate(234deg)', backgroundColor: '#e74c3c' }}></div>
                  </div>
                )}
              </div>
              <p className="refresh-info">
                Data refreshes every {config.refreshInterval} seconds
              </p>
            </div>
          </div>
        </div>

        <div className="configuration-panel">
          <div className="configuration-header">
            <h2>Configuration</h2>
            {user?.isGuest && (
              <div className="guest-notice">
                <p>You're configuring as a guest. Settings will be saved to this browser only.</p>
                <Link href="/auth" className="auth-link">Sign in</Link> to save across devices.
              </div>
            )}
          </div>

          <div className="configuration-form">
            <div className="form-group">
              <label htmlFor="configName">Configuration Name</label>
              <input
                id="configName"
                type="text"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="refreshInterval">Refresh Interval (seconds)</label>
              <input
                id="refreshInterval"
                type="number"
                min="5"
                max="300"
                value={config.refreshInterval || 60}
                onChange={(e) => updateConfig('refreshInterval', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="chartType">Chart Type</label>
              <select
                id="chartType"
                value={config.chartType || 'line'}
                onChange={(e) => updateConfig('chartType', e.target.value)}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={config.showLegend || false}
                  onChange={(e) => updateConfig('showLegend', e.target.checked)}
                />
                Show Legend
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={config.showGrid || true}
                  onChange={(e) => updateConfig('showGrid', e.target.checked)}
                />
                Show Grid
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="colorTheme">Color Theme</label>
              <select
                id="colorTheme"
                value={config.colorTheme || 'blue'}
                onChange={(e) => updateConfig('colorTheme', e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
              </select>
            </div>

            <div className="save-actions">
              <button 
                className="save-config-btn" 
                onClick={saveConfiguration}
                disabled={saving || !user}
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
              {savedMessage && <div className="saved-message">{savedMessage}</div>}
              {!user && (
                <div className="auth-required">
                  <Link href="/auth">Sign in</Link> to save your configuration
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 