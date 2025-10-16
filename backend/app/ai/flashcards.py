from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import app.utils.helpers as tools
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

# Initialize LLM (Ollama local model or OpenRouter alternative)
# llm = ChatOpenAI(
#     model_name="moonshotai/kimi-k2:free",
#     temperature=0.3,
#     openai_api_base="https://openrouter.ai/api/v1",
#     openai_api_key=os.environ.get("OPENROUTER_API_KEY"),
# )

llm = ChatOllama(model="gemma3:12b", temperature=0.3, base_url="http://localhost:11434")

# Simple short-form flashcard prompt
FLASHCARD_PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""
Task:
Generate *short, simple flashcards* from the text below, in the **same language as the text**.

Rules:
1. Each flashcard must include:
   - "question": short question (max 12 words)
   - "answer": short answer (max 10 words)
2. Generate **at most 10 flashcards** per input text.
3. Use the same language as the input text.
4. Keep it beginner-friendly and easy to review.
5. Focus on facts, names, dates, and key ideas.
6. Do NOT write long explanations, commentary, or analysis.
7. Output **only valid JSON**, no markdown, no extra text.
8. If the text is unclear, return exactly:
   {{"error": "I don't understand the text"}}

Output Format Example:
[
  {{"question": "Who led the war?", "answer": "Mustafa Kemal"}},
  {{"question": "When was the Republic founded?", "answer": "1923"}}
]

Text:
{text}

Instruction:
RETURN ONLY VALID JSON IN THE SAME LANGUAGE AS THE INPUT TEXT, WITH **NO MORE THAN 10 FLASHCARDS**:
""",
)


chain = LLMChain(llm=llm, prompt=FLASHCARD_PROMPT)


def generate_flashcards(text: str) -> list:
    """Generates short, simple flashcards and returns valid JSON (Python list)."""
    tools.debug_print([f"Generating flashcards..."])
    tools.debug_print([f"Text length: {len(text)}"])

    result = chain.run({"text": text}).strip()
    # Strip ```json ... ``` wrappers if present
    result = re.sub(
        r"^```(?:json)?|```$", "", result.strip(), flags=re.MULTILINE
    ).strip()

    try:
        flashcards = json.loads(result)
        # Optional sanity trimming
        for card in flashcards:
            if isinstance(card.get("answer"), str) and len(card["answer"]) > 60:
                card["answer"] = card["answer"][:57].rstrip() + "..."
        tools.debug_print([f"Generated {len(flashcards)} flashcards"])
        return flashcards
    except json.JSONDecodeError:
        tools.debug_print(["Failed to parse JSON output from model"])
        tools.debug_print([f"Raw output: {result}"])
        return {"error": "Invalid JSON output from model"}
    except Exception as e:
        tools.debug_print([f"Unexpected error: {e}"])
        return {"error": "Unexpected error occurred"}
