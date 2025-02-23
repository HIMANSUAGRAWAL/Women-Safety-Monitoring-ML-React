import os
import fitz  # PyMuPDF
import pandas as pd

# Define the path to the dataset
data_path = r"C:\Users\himan\OneDrive\Desktop\HACKATHON\data\data"

def extract_text_from_pdfs(data_path):
    resume_data = []
    for category in os.listdir(data_path):
        category_path = os.path.join(data_path, category)
        if os.path.isdir(category_path):
            for file in os.listdir(category_path):
                if file.endswith(".pdf"):
                    file_path = os.path.join(category_path, file)
                    doc = fitz.open(file_path)
                    text = ""
                    for page in doc:
                        text += page.get_text("text")
                    resume_data.append([file, text, category])
    return pd.DataFrame(resume_data, columns=["ID", "Resume", "Category"])

df = extract_text_from_pdfs(data_path)
df.to_csv(r"C:\Users\himan\OneDrive\Desktop\HACKATHON\Resume\Resume.csv", index=False)

print(df.head())


#Step 2: Text Preprocessing

import spacy
import nltk
from nltk.corpus import stopwords
import re

nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    doc = nlp(text)
    tokens = [token.lemma_ for token in doc if token.text not in stop_words]
    return " ".join(tokens)

df["Cleaned_Resume"] = df["Resume"].apply(preprocess_text)
df.to_csv("cleaned_resumes.csv", index=False)
