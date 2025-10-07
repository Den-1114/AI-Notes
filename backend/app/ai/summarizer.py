from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
import app.utils.helpers as tools
from dotenv import load_dotenv
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv()

# Initialize OpenRouter via ChatOpenAI (reused across calls)
llm = ChatOpenAI(
    model_name="deepseek/deepseek-chat-v3.1:free",
    temperature=0.3,
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=os.environ.get("OPENROUTER_API_KEY"),
)

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

# Reuse chain for efficiency
chain = LLMChain(llm=llm, prompt=SUMMARY_PROMPT)


def summarize_chunk(chunk: str, idx: int, total: int) -> str:
    """Helper function to summarize a single chunk"""
    tools.debug_print([f"Summarizing chunk {idx}/{total}..."])
    return chain.run({"text": chunk}).strip()


def generate_chapter_summary(content: str, max_workers: int = 4) -> str:
    """Generate a large, detailed summary of the chapter with threading"""

    # 1️⃣ Split content into manageable chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=12000,  # safe for context window
        chunk_overlap=300,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_text(content)
    tools.debug_print([f"Text split into {len(chunks)} chunks."])

    # 2️⃣ Run summarization in parallel
    chunk_summaries = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(summarize_chunk, chunk, i + 1, len(chunks)): i
            for i, chunk in enumerate(chunks)
        }

        for future in as_completed(futures):
            try:
                chunk_summaries.append(future.result())
            except Exception as e:
                tools.debug_print([f"Error in chunk {futures[future] + 1}: {e}"])

    # 3️⃣ Combine chunk summaries into a final summary
    tools.debug_print(["Combining chunk summaries..."])
    combined_summary = "\n\n".join(chunk_summaries)

    return combined_summary
