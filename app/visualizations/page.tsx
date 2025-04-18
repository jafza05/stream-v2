"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/Navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { useSearchParams } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import Link from "next/link";

// Create a data client
const dataClient = generateClient<Schema>();

export default function VisualizationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [visualizationTypes, setVisualizationTypes] = useState<Schema["VisualizationType"]["type"][]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // Fetch visualization types
  useEffect(() => {
    const fetchVisualizationTypes = async () => {
      try {
        // If category is provided, filter by it
        let filter = {};
        if (category) {
          filter = {
            name: {
              // This is a simple contains filter, in a real app you'd have a proper category field
              contains: category.charAt(0).toUpperCase() + category.slice(1)
            }
          };
        }

        const { data } = await dataClient.models.VisualizationType.list({
          filter
        });
        setVisualizationTypes(data);
      } catch (error) {
        console.error("Error fetching visualization types:", error);
        // For demo purposes, set some dummy data if no visualization types exist yet
        setVisualizationTypes([
          {
            id: "sports-1",
            name: "Sports Dashboard",
            description: "Real-time sports scores and statistics",
            dataSourceType: "API",
            dataSourceConfig: JSON.stringify({
              endpoint: "https://api.example.com/sports"
            }),
            defaultConfig: JSON.stringify({
              refreshInterval: 60,
              showScores: true,
              showStats: true
            })
          },
          {
            id: "financial-1",
            name: "Financial Markets",
            description: "Stock and cryptocurrency real-time data",
            dataSourceType: "WEBSOCKET",
            dataSourceConfig: JSON.stringify({
              endpoint: "wss://stream.example.com/finance"
            }),
            defaultConfig: JSON.stringify({
              refreshInterval: 5,
              showTickers: true,
              charts: ["line", "candle"]
            })
          },
          {
            id: "weather-1",
            name: "Weather Dashboard",
            description: "Weather data and forecasts for any location",
            dataSourceType: "API",
            dataSourceConfig: JSON.stringify({
              endpoint: "https://api.example.com/weather"
            }),
            defaultConfig: JSON.stringify({
              refreshInterval: 300,
              units: "metric",
              showForecast: true
            })
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVisualizationTypes();
  }, [category]);

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading visualizations...</p>
      </div>
    );
  }

  return (
    <main className="main-container">
      <Navigation />

      <div className="visualizations-header">
        <h1>
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Visualizations` 
            : "All Visualizations"}
        </h1>
        <p>Select a visualization to configure and view</p>
      </div>

      <div className="visualizations-grid">
        {visualizationTypes.length > 0 ? (
          visualizationTypes.map((type) => (
            <div key={type.id} className="visualization-card">
              <h2>{type.name}</h2>
              <p>{type.description}</p>
              <div className="visualization-card-footer">
                <span className="data-source-badge">
                  {type.dataSourceType}
                </span>
                <Link
                  href={`/visualizations/${type.id}`}
                  className="view-visualization-btn"
                >
                  Configure & View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-visualizations">
            <p>No visualizations found for this category.</p>
            <Link href="/visualizations" className="back-btn">
              View all visualizations
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 