from flask import Flask, request, jsonify, render_template,session
import joblib, pandas as pd
import numpy as np
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

app.secret_key = "fitplan_secret_key"
model = joblib.load('obesity_model.pkl')
diet_model=joblib.load('diet_model.pkl')

label_encoder = joblib.load("meal_encoder.pkl")


@app.route("/")
def home():
    return render_template("home.html")


@app.route('/obesity')
def obesity():
    return render_template('obesity.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    age = float(data['age'])
    weight = float(data['weight'])

    # User enters feet
    height_ft = float(data['height'])

    # Convert to cm
    height_cm = height_ft * 30.48

    # Convert to meters for BMI
    height_m = height_cm / 100

    gender = int(data['gender'])

    bmi = weight / (height_m ** 2)

    # Store cm in session
    session['age'] = age
    session['weight'] = weight
    session['height'] = height_ft
    session['gender'] = gender


    user = pd.DataFrame([[age, weight, height_cm, bmi, gender]],
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
     print("SESSION DATA:", dict(session))
     age = session.get('age')
     weight = session.get('weight')
     height = session.get('height')
     gender = session.get('gender')

     return render_template('diet_planner.html',age=age,
        weight=weight,
        height=height,
        gender=gender)
    

@app.route('/diet_plan', methods=['POST'])
def diet_plan():

    # GET JSON DATA
    data = request.json

    # ======================================
    # INPUTS
    # ======================================

    age = session.get('age') or float(data['age'])
    weight = session.get('weight') or float(data['weight'])
    height_ft = session.get('height') or float(data['height'])
    gender = session.get('gender') if session.get('gender') is not None else int(data['gender'])
    activity_level = int(data['activity_level'])

    health_condition = int(data['health_condition'])

    calorie_target = float(data['calorie_target'])

    # ======================================
    # BMI CALCULATION
    # ======================================
    height_cm = height_ft * 30.48

    height_m = height_cm / 100
 
    bmi = weight / (height_m ** 2)
    print("SESSION:")
    print("age =", age)
    print("weight =", weight)
    print("height_ft =", height_ft)
    print("height_cm =", height_cm)
    print("BMI =", bmi)
    # ======================================
    # CREATE INPUT ARRAY
    # ======================================

    input_data = np.array([[
        age,
        gender,
        height_cm,
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

   

    # RETURN RESPONSE
  

    return jsonify({

        "diet": predicted_diet[0],
        "bmi": round(bmi, 2)

    })


@app.route("/exercise_timetable")
def timetable():
    return render_template('exercise_timetable.html')

@app.route('/exercise_timetable', methods=['POST'])
def exercise_timetable():
    data = request.json
    return render_template('exercise_timetable.html',
        obesity_level = data['obesity_level'],
        diet_plan     = data['diet_plan'],
        bmi           = data['bmi']
    )

if __name__ == '__main__':
    app.run(debug=True)