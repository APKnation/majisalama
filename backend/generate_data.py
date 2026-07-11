import csv
import random
from datetime import datetime, timedelta

districts = ["Ilala", "Kinondoni", "Temeke", "Kigamboni", "Ubungo", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro"]
years = list(range(2005, 2025))
months = list(range(1, 13))

district_profiles = {}
for district in districts:
    district_profiles[district] = {
        'income_level': random.randint(1, 5),
        'industrial_activity': random.randint(0, 100),
        'tourism': random.randint(0, 100),
        'pipe_age': random.randint(1, 50),
        'leakage_rate': round(random.uniform(5.0, 40.0), 1),
        'storage_capacity': random.randint(10000, 500000)
    }

header = [
    "temperature", "rainfall", "humidity", "population", "water_level", "pH", "turbidity", "flow_rate",
    "district", "month", "year", "day_of_week", "season", "is_weekend", "is_holiday",
    "income_level", "industrial_activity", "tourism",
    "pipe_age", "leakage_rate", "storage_capacity",
    "forecast_rainfall", "forecast_temperature",
    "demand_lag_1m", "demand_lag_3m", "demand_lag_6m",
    "demand"
]

rows = []
for district in districts:
    profile = district_profiles[district]
    demand_history = []
    
    for year in years:
        for month in months:
            date = datetime(year, month, 1)
            day_of_week = date.weekday()
            season = "Rainy" if month in [3, 4, 5, 11] else "Dry" if month in [6, 7, 8, 9, 10] else "Short Rains" if month == 12 else "Hot"
            is_weekend = 1 if day_of_week >= 5 else 0
            is_holiday = 1 if random.random() < 0.05 else 0
            
            temp = round(random.uniform(20.0, 35.0), 1)
            rainfall = round(random.uniform(0.0, 300.0), 1)
            humidity = round(random.uniform(40.0, 95.0), 1)
            forecast_rainfall = round(rainfall * random.uniform(0.5, 1.5), 1)
            forecast_temperature = round(temp * random.uniform(0.95, 1.05), 1)
            
            water_level = round(random.uniform(10.0, 200.0), 1)
            ph = round(random.uniform(6.5, 8.5), 2)
            turbidity = round(random.uniform(0.5, 5.0), 2)
            flow_rate = round(random.uniform(10.0, 100.0), 1)
            
            pop = random.randint(50000, 500000) + (year - 2005) * random.randint(500, 2000)
            
            base_demand = pop * random.uniform(2.5, 4.0)
            temp_effect = (temp - 25) * 1000
            rain_effect = -rainfall * 500
            economic_effect = profile['income_level'] * 50000 + profile['industrial_activity'] * 1000 + profile['tourism'] * 500
            infra_effect = -profile['leakage_rate'] * 5000 - profile['pipe_age'] * 1000
            
            demand = int(base_demand + temp_effect + rain_effect + economic_effect + infra_effect)
            demand = max(demand, 1000)
            
            if len(demand_history) >= 1:
                demand_lag_1m = demand_history[-1]
            else:
                demand_lag_1m = int(demand * random.uniform(0.9, 1.1))
            if len(demand_history) >= 3:
                demand_lag_3m = demand_history[-3]
            else:
                demand_lag_3m = int(demand * random.uniform(0.85, 1.15))
            if len(demand_history) >= 6:
                demand_lag_6m = demand_history[-6]
            else:
                demand_lag_6m = int(demand * random.uniform(0.8, 1.2))
            
            demand_history.append(demand)
            if len(demand_history) > 6:
                demand_history.pop(0)
            
            rows.append([
                temp, rainfall, humidity, pop, water_level, ph, turbidity, flow_rate,
                district, month, year, day_of_week, season, is_weekend, is_holiday,
                profile['income_level'], profile['industrial_activity'], profile['tourism'],
                profile['pipe_age'], profile['leakage_rate'], profile['storage_capacity'],
                forecast_rainfall, forecast_temperature,
                demand_lag_1m, demand_lag_3m, demand_lag_6m,
                demand
            ])

with open("water.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(header)
    writer.writerows(rows)

print(f"Generated {len(rows)} rows in water.csv")
