"""
Mausam AI - Alert Priority & Personal Relevance Ranking Engine
Problem: SIH 2026 - Development of Personalized Homepage for 'Mausam' Mobile Application
Formula: Severity (0-10) + Location (0-10) + User Relevance (0-10) = Alert Priority (0-30)
"""

import pandas as pd
import numpy as np

class AlertRelevanceRanker:
    """
    Ranks meteorological advisories dynamically based on user profile,
    geographical distance to storm cell, and hazard severity.
    """

    HAZARD_RELEVANCE_MATRIX = {
        # Matrix of user_type vs hazard category weights (0-10)
        'student': {'rain': 9.5, 'thunderstorm': 8.5, 'aqi': 7.5, 'heatwave': 6.0, 'flood': 9.0, 'wind': 6.5},
        'office_worker': {'rain': 9.0, 'thunderstorm': 8.5, 'aqi': 8.0, 'heatwave': 6.5, 'flood': 9.5, 'wind': 7.0},
        'farmer': {'rain': 10.0, 'thunderstorm': 9.5, 'heatwave': 9.0, 'flood': 10.0, 'wind': 8.5, 'aqi': 4.0},
        'outdoor_worker': {'heatwave': 10.0, 'uv': 10.0, 'thunderstorm': 9.5, 'rain': 9.0, 'aqi': 9.0, 'wind': 8.5},
        'traveller': {'thunderstorm': 9.5, 'rain': 9.0, 'flood': 9.5, 'wind': 8.0, 'heatwave': 7.0, 'aqi': 6.0},
        'general_user': {'thunderstorm': 8.0, 'rain': 7.5, 'flood': 8.5, 'heatwave': 7.0, 'aqi': 7.0, 'wind': 6.5}
    }

    def calculate_priority(self, severity_score: float, location_score: float, category: str, user_type: str) -> dict:
        """
        Calculates composite priority score (0-30).
        """
        user_weights = self.HAZARD_RELEVANCE_MATRIX.get(user_type, self.HAZARD_RELEVANCE_MATRIX['general_user'])
        user_relevance = user_weights.get(category.lower(), 7.0)

        # SIH Core Formula
        total_priority = round(severity_score + location_score + user_relevance, 1)

        tier = "P3 - Standard"
        if total_priority >= 25:
            tier = "P1 - Critical Urgent"
        elif total_priority >= 18:
            tier = "P2 - High Watch"

        return {
            "severity_score": severity_score,
            "location_score": location_score,
            "user_relevance_score": user_relevance,
            "total_priority": total_priority,
            "max_possible": 30.0,
            "priority_tier": tier
        }

    def rank_alerts_df(self, alerts_data: list, user_type: str) -> pd.DataFrame:
        """
        Converts alerts list into a Pandas DataFrame and sorts descending by total_priority.
        """
        df = pd.DataFrame(alerts_data)
        
        calculated_priorities = []
        for _, row in df.iterrows():
            p = self.calculate_priority(
                severity_score=row['severity_score'],
                location_score=row['location_score'],
                category=row['category'],
                user_type=user_type
            )
            calculated_priorities.append(p['total_priority'])

        df['calculated_priority'] = calculated_priorities
        # Sort descending
        return df.sort_values(by='calculated_priority', ascending=False)

if __name__ == '__main__':
    ranker = AlertRelevanceRanker()
    alerts = [
        {'id': 1, 'title': 'Loo Heatwave Warning', 'severity_score': 9, 'location_score': 8, 'category': 'heatwave'},
        {'id': 2, 'title': 'Urban Waterlogging Alert', 'severity_score': 8, 'location_score': 9, 'category': 'rain'},
        {'id': 3, 'title': 'Moderate Breeze', 'severity_score': 2, 'location_score': 6, 'category': 'wind'}
    ]
    df_student = ranker.rank_alerts_df(alerts, 'student')
    print("Ranked for Student:\n", df_student[['title', 'calculated_priority']])
    
    df_farmer = ranker.rank_alerts_df(alerts, 'farmer')
    print("\nRanked for Farmer:\n", df_farmer[['title', 'calculated_priority']])
