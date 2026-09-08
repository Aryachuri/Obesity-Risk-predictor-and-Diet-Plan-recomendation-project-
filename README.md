# 🥗 Obesity Risk Prediction and Diet Plan Recommendation

## 📌 Overview

**Obesity Risk Prediction and Diet Plan Recommendation** is a machine learning project designed to predict an individual's obesity risk based on health, lifestyle, and dietary factors.

The system analyzes parameters such as **age, gender, height, weight, BMI, chronic diseases, blood pressure, cholesterol, daily physical activity, dietary habits, and caloric intake** to estimate obesity risk.

Based on the user's profile and predicted risk, the system also provides a **personalized diet plan recommendation**.

> ⚠️ **Disclaimer:** This project is developed for educational and research purposes. The predictions and recommendations are not intended to replace professional medical or nutritional advice.

---

## 🎯 Objectives

* Predict obesity risk using machine learning.
* Analyze health, lifestyle, and dietary factors associated with obesity.
* Calculate and use BMI as an important health indicator.
* Classify users according to their predicted obesity risk.
* Provide personalized diet recommendations.
* Demonstrate the practical application of machine learning in healthcare-related systems.

---

## ✨ Features

### 🤖 Obesity Risk Prediction

The system uses machine learning to predict the user's obesity risk based on their input data.

### 📊 Health Analysis

The application considers multiple factors, including:

* Age
* Gender
* Height
* Weight
* BMI
* Chronic disease
* Blood pressure
* Cholesterol
* Daily steps
* Dietary habits
* Caloric intake

### 🥗 Diet Plan Recommendation

After evaluating the user's profile, the system generates a suitable diet recommendation.

The recommendation can include:

* Breakfast
* Morning snack
* Lunch
* Evening snack
* Dinner
* Foods to prefer
* Foods to limit

---

## 🔄 System Workflow

```text
                User Information
                       │
                       ▼
                Data Preprocessing
                       │
                       ▼
                 Feature Engineering
                       │
                       ▼
                  ML Model
                       │
                       ▼
              Obesity Risk Prediction
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Low Risk  Moderate   High Risk
                       │
                       ▼
                Diet Recommendation
```

---

## 🧠 Machine Learning

### Dataset

The dataset contains health, lifestyle, and dietary attributes that can be used to predict obesity risk.

Example features:

| Feature           | Description                 |
| ----------------- | --------------------------- |
| `Age`             | Age of the individual       |
| `Gender`          | Gender                      |
| `Height_cm`       | Height in centimeters       |
| `Weight_kg`       | Weight in kilograms         |
| `BMI`             | Body Mass Index             |
| `Chronic_Disease` | Chronic disease information |
| `Blood_Pressure`  | Blood pressure information  |
| `Cholesterol`     | Cholesterol information     |
| `Daily_Steps`     | Average daily steps         |
| `Dietary_Habits`  | Dietary behavior            |
| `Caloric_Intake`  | Daily caloric intake        |

---

## 🧮 BMI Calculation

BMI is calculated using:

```text
BMI = Weight (kg) / Height² (m²)
```

For example:

```python
bmi = weight_kg / (height_m ** 2)
```

BMI can then be used as one of the features for the machine learning model.

---

## 🧹 Data Preprocessing

The following preprocessing techniques can be applied to the dataset:

* Handling missing values
* Removing duplicate records
* Handling inconsistent data
* Encoding categorical variables
* Feature selection
* Feature scaling where required
* Train-test splitting

Example:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)
```

---

## 🌲 Machine Learning Model

The project uses **Random Forest Classifier** for obesity risk prediction.

Random Forest is an ensemble learning algorithm that combines multiple decision trees to make predictions.

Example implementation:

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)
```

Prediction:

```python
prediction = model.predict(X_test)
```

---

## 📈 Model Evaluation

The model can be evaluated using:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix
* ROC-AUC

Example:

```python
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))

print(classification_report(y_test, y_pred))

print(confusion_matrix(y_test, y_pred))
```

---

## 🥗 Diet Recommendation

The diet recommendation module uses the user's health profile and predicted risk to generate suitable dietary suggestions.

Example:

```text
User Profile
     │
     ▼
BMI + Lifestyle + Dietary Information
     │
     ▼
Obesity Risk Prediction
     │
     ▼
Diet Recommendation Rules
     │
     ▼
Personalized Diet Plan
```

A recommendation may contain:

### Breakfast

* Oatmeal
* Fruits
* Low-fat dairy

### Lunch

* Vegetables
* Whole grains
* Lean protein

### Evening Snack

* Fruits
* Nuts in controlled portions

### Dinner

* Vegetables
* Protein-rich foods
* Controlled carbohydrate portions

The actual recommendations depend on the rules and data implemented in the project.

---

## 🛠️ Technologies Used

### Programming

* Python

### Machine Learning

* Scikit-learn
* Pandas
* NumPy

### Data Analysis & Visualization

* Matplotlib
* Seaborn

### Development

* Jupyter Notebook / Google Colab

### Web Application *(if applicable)*

* Flask
* HTML
* CSS
* JavaScript

---

## 📂 Project Structure

```text
obesity-risk-prediction/
│
├── static/
│   ├── css/
│   │   ├── diet_planner.css
│   │   ├── exercise_timetable.css
│   │   ├── home.css
│   │   └── obesity.css
│   │
│   └── js/
│       ├── diet_planner.js
│       ├── exercise_timetable.js
│       └── obesity.js
│
├── templates/
│   ├── diet_planner.html
│   ├── exercise_timetable.html
│   ├── home.html
│   └── obesity.html
│
├── app.py
├── diet_model.pkl
├── exercise_timetable.html
├── meal_encoder.pkl
├── obesity.html
├── obesity_model.pkl
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/obesity-risk-prediction.git
```

```bash
cd obesity-risk-prediction
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the environment

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

If the project contains a Flask application:

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000/
```

in your browser.

---

## 📦 Requirements

Example `requirements.txt`:

```text
numpy
pandas
scikit-learn
matplotlib
seaborn
flask
joblib
```

---

## 🔮 Future Improvements

Possible improvements include:

* Compare Random Forest with Logistic Regression, Decision Tree, SVM, and XGBoost.
* Perform hyperparameter tuning.
* Improve model accuracy with a larger and more diverse dataset.
* Add Explainable AI using SHAP.
* Add calorie requirements estimation.
* Add exercise recommendations.
* Add user authentication.
* Store user prediction history.
* Add an interactive dashboard.
* Deploy the application to a cloud platform.
* Improve the diet recommendation system using a larger nutrition dataset.

---

## ⚠️ Limitations

* Prediction quality depends on the dataset used for training.
* Self-reported lifestyle and dietary information may contain inaccuracies.
* The model cannot account for every genetic, environmental, or medical factor.
* Diet recommendations are general and may not be appropriate for every individual.
* The system is not a clinical diagnostic tool.

---

## 👨‍💻 Author

**Arya Churi**

GitHub: `https://github.com/your-username`

---

## 📜 License

This project is intended for **educational and research purposes**.

If you intend to distribute the project publicly, an appropriate open-source license such as the MIT License can be added.

---

## ⚕️ Medical Disclaimer

This application is **not a medical diagnostic system**. The obesity risk prediction and diet recommendations are generated using machine learning and predefined recommendation logic.

Users should consult a **qualified healthcare professional or registered dietitian** before making significant changes to their diet, exercise routine, or healthcare decisions.
