import os

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
print(os.getenv("GOOGLE_API_KEY"))

class GeminiService:

    def __init__(self):

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite",
            temperature=0.4,
            api_key=os.getenv("GOOGLE_API_KEY"),
        )

    def get_llm(self):
        return self.llm


gemini = GeminiService()