import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)
    total_crime = df["Total Crime"].sum()
    total_kidnapping = df["KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS"].sum()
    total_rape = df["RAPE"].sum()
    
    district_crime = df.groupby(["STATE/UT", "DISTRICT"])[["Total Crime", "KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS", "RAPE"]].sum().reset_index()
    district_crime["Crime_Percentage"] = (district_crime["Total Crime"] / total_crime) * 100
    district_crime["Kidnapping_Percentage"] = (district_crime["KIDNAPPING AND ABDUCTION OF WOMEN AND GIRLS"] / total_kidnapping) * 100
    district_crime["Rape_Percentage"] = (district_crime["RAPE"] / total_rape) * 100
    
    # Define Red Zone threshold (adjustable)
    red_zone_threshold = 5.0  # Example threshold
    district_crime["Zone"] = district_crime["Crime_Percentage"].apply(lambda x: "Red Zone" if x > red_zone_threshold else "Safe Zone")
    
    return district_crime

def display_state_and_district(district_crime):
    states = district_crime["STATE/UT"].unique()
    print("Available States:")
    for i, state in enumerate(states, 1):
        print(f"{i}. {state}")
    
    while True:
        state_choice = input("Select a State by number: ").strip()
        if state_choice.isdigit() and 1 <= int(state_choice) <= len(states):
            state_choice = int(state_choice) - 1
            break
        else:
            print("Invalid input. Please enter a valid number corresponding to a state.")
    
    selected_state = states[state_choice]
    state_districts = district_crime[district_crime["STATE/UT"] == selected_state]
    
    print("\nAvailable Districts:")
    districts = state_districts["DISTRICT"].unique()
    for i, district in enumerate(districts, 1):
        print(f"{i}. {district}")
    
    while True:
        district_choice = input("Select a District by number: ").strip()
        if district_choice.isdigit() and 1 <= int(district_choice) <= len(districts):
            district_choice = int(district_choice) - 1
            break
        else:
            print("Invalid input. Please enter a valid number corresponding to a district.")
    
    selected_district = districts[district_choice]
    crime_data = state_districts[state_districts["DISTRICT"] == selected_district]
    
    crime_percentage = crime_data["Crime_Percentage"].values[0]
    zone_status = crime_data["Zone"].values[0]
    
    print("\nCrime Statistics for Selected District:")
    print(f"State: {selected_state}")
    print(f"District: {selected_district}")
    print(f"Crime Percentage: {crime_percentage:.2f}%")
    print(f"Zone Status: {zone_status}")

# Load and process data
district_crime = load_and_preprocess_data("Historical crime data 2001-2014.csv")

# Display state and district options
display_state_and_district(district_crime)


