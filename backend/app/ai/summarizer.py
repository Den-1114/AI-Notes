from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import app.utils.helpers as tools
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize OpenRouter via ChatOpenAI (reused across calls)
# llm = ChatOpenAI(
#     model_name="moonshotai/kimi-k2:free",
#     temperature=0.3,
#     openai_api_base="https://openrouter.ai/api/v1",
#     openai_api_key=os.environ.get("OPENROUTER_API_KEY"),
# )

llm = ChatOllama(model="gemma3:12b", temperature=0.3, base_url="http://localhost:11434")

# Reusable prompt template
SUMMARY_PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""
Task:
    Create an in-depth, comprehensive study guide for the following chapter. The summary should be thorough enough for a student to use for review and deep understanding.

Requirements:
1. Main Topics and Concepts: Identify and explain all the primary subjects covered in the chapter.
2. Detailed Explanations: Provide clear, step-by-step explanations of key ideas and concepts.
3. Important Definitions and Terms: List and define all significant terminology.
4. Examples and Applications: Include practical examples, scenarios, or applications that illustrate each concept.
5. Key Takeaways and Conclusions: Highlight essential points, insights, and conclusions from the chapter.

Style and Format:
- Make the summary organized, structured, and easy to follow.
- Use headings, subheadings, and bullet points where appropriate.
- Ensure explanations are precise, detailed, and suitable for students reviewing for exams or assignments.
- Focus only on the content of the chapter—do not add unrelated information or commentary.
- Write the summary in the language of the chapter provided. For example, if the chapter is in Spanish, write the summary in Spanish.

DO NOT INCLUDE ANY OTHER TEXT LIKE: "Do you need any other information?"; "I hope this is helpful"; etc."
If you dont understand the text, just say "I don't understand the text", do not halucinate.

Chapter Content:
{text}

Instruction:
DETAILED CHAPTER SUMMARY:
""",
)


chain = LLMChain(llm=llm, prompt=SUMMARY_PROMPT)


def summarize_text(text: str) -> str:
    """Summarizes the input text using chunking and parallel processing"""
    tools.debug_print([f"Summarizing..."])
    tools.debug_print([f"Text length: {len(text)}"])
    summary = chain.run({"text": text}).strip()
    tools.debug_print([f"Summary length: {len(summary)}"])
    return summary
