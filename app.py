from flask import Flask, request, jsonify, render_template
import joblib, pandas as pd
import numpy as np

app = Flask(__name__)
model = joblib.load('obesity_model.pkl')
diet_model=joblib.load('diet_model.pkl')

label_encoder = joblib.load("meal_encoder.pkl")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    age    = float(data['age'])
    weight = float(data['weight'])
    height = float(data['height']) / 100   # cm to m
    gender = int(data['gender'])
    bmi    = weight / (height ** 2)

    user = pd.DataFrame([[age, weight, height*100, bmi, gender]],
                         columns=['Age','Weight','Height','BMI','Gender'])

    prediction    = model.predict(user)[0]
    probabilities = model.predict_proba(user)[0]
    classes       = model.classes_.tolist()

    return jsonify({
        'prediction': prediction,
        'bmi': round(bmi, 2),
        'probabilities': dict(zip(classes, [round(p*100,1) for p in probabilities]))
    })


@app.route('/diet')
def diet():
    return render_template('diet_planner.html')

@app.route('/diet_plan', methods=['POST'])
def diet_plan():

    # GET JSON DATA
    data = request.json

    # ======================================
    # INPUTS
    # ======================================

    age = float(data['age'])

    weight = float(data['weight'])

    height = float(data['height']) / 100

    gender = int(data['gender'])

    activity_level = int(data['activity_level'])

    health_condition = int(data['health_condition'])

    calorie_target = float(data['calorie_target'])

    # ======================================
    # BMI CALCULATION
    # ======================================

    bmi = weight / (height ** 2)

    # ======================================
    # CREATE INPUT ARRAY
    # ======================================

    input_data = np.array([[
        age,
        gender,
        height * 100,
        weight,
        bmi,
        activity_level,
        health_condition,
        calorie_target
    ]])

    # ======================================
    # MODEL PREDICTION
    # ======================================

    prediction = diet_model.predict(input_data)

    # CONVERT LABEL TO TEXT
    predicted_diet = label_encoder.inverse_transform(
        prediction
    )

    # ======================================
    # RETURN RESPONSE
    # ======================================

    return jsonify({

        "diet": predicted_diet[0],
        "bmi": round(bmi, 2)

    })





if __name__ == '__main__':
    app.run(debug=True)