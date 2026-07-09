import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import joblib
import os

def main():
    # Load the data
    print("Loading data from water.csv...")
    csv_path = os.path.join(os.path.dirname(__file__), 'water.csv')
    df = pd.read_csv(csv_path)

    # Features and Target
    X = df[['temperature', 'rainfall', 'humidity', 'population', 'water_level', 'pH', 'turbidity', 'flow_rate', 'district', 'month']]
    y = df['demand']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Preprocessing
    categorical_features = ['district', 'month']
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough' # Leave numerical features as they are
    )

    # Initialize pipeline
    print("Training Random Forest model pipeline...")
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # Train model
    model.fit(X_train, y_train)

    # Evaluate
    score = model.score(X_test, y_test)
    print(f"Model R^2 Score on test set: {score:.4f}")

    # Save model pipeline
    model_path = os.path.join(os.path.dirname(__file__), 'water_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    main()
