import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import os

def main():
    print("Loading data from water.csv...")
    csv_path = os.path.join(os.path.dirname(__file__), 'water.csv')
    df = pd.read_csv(csv_path)

    df['demand_per_capita'] = df['demand'] / df['population']

    numerical_features = ['temperature', 'rainfall', 'humidity', 'population', 'water_level', 'pH', 'turbidity', 'flow_rate']
    categorical_features = ['district', 'month']

    X = df[numerical_features + categorical_features]
    y = df['demand_per_capita']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )

    print("Training Random Forest model pipeline...")
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)
    print(f"Model R^2 Score on test set: {score:.4f}")

    y_pred = model.predict(X)
    df['predicted_demand'] = y_pred * df['population']
    df['actual_demand'] = df['demand']
    df['error'] = df['actual_demand'] - df['predicted_demand']
    print(f"Mean Absolute Error (total demand): {df['error'].abs().mean():.2f}")
    print(f"Sample actual vs predicted total demand:")
    print(df[['district', 'population', 'actual_demand', 'predicted_demand']].head())

    model_path = os.path.join(os.path.dirname(__file__), 'water_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    main()
