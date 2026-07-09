import csv
import random

# Columns: temperature, rainfall, humidity, population, water_level, pH, turbidity, flow_rate, district, month, demand
districts = ["Ilala", "Kinondoni", "Temeke", "Kigamboni", "Ubungo", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro"]
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

with open("water.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["temperature", "rainfall", "humidity", "population", "water_level", "pH", "turbidity", "flow_rate", "district", "month", "demand"])
    
    for _ in range(500):
        temp = round(random.uniform(20.0, 35.0), 1)
        rainfall = round(random.uniform(0.0, 300.0), 1)
        humidity = round(random.uniform(40.0, 95.0), 1)
        pop = random.randint(5000, 500000)
        water_level = round(random.uniform(10.0, 200.0), 1)
        ph = round(random.uniform(6.5, 8.5), 2)
        turbidity = round(random.uniform(0.5, 5.0), 2)
        flow_rate = round(random.uniform(10.0, 100.0), 1)
        district = random.choice(districts)
        month = random.choice(months)
        
        # Simple heuristic for demand (higher pop, higher temp -> more demand)
        demand = int(pop * random.uniform(2.5, 4.0) + (temp * 1000) - (rainfall * 500))
        if demand < 1000:
            demand = 1000
            
        writer.writerow([temp, rainfall, humidity, pop, water_level, ph, turbidity, flow_rate, district, month, demand])

print("Generated 500 rows in water.csv")
