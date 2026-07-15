import os
import sys
from pathlib import Path
from datasets import Dataset
import asyncio
from dotenv import load_dotenv
import django

# Set up paths
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent
sys.path.insert(0, str(backend_dir))
load_dotenv(root_dir / ".env")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')
django.setup()

# Must import after dotenv and django.setup()
from core.agents.ChatBot import ChatBot
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

import json

DATASET_CACHE = backend_dir / "eval_dataset.json"

QUESTIONS = [
    "What is the procedure to file an FIR for a stolen item?",
    "What are the fundamental rights of a citizen regarding unlawful arrest?",
    "How do I send a legal notice to a tenant who hasn't paid rent?"
]

GROUND_TRUTHS = [
    "You must go to the nearest police station immediately, provide full details of the stolen item and the incident, sign the written complaint, and ensure the police officer registers the FIR and gives you a copy.",
    "A citizen has the right to be informed of the grounds of arrest, the right to consult a lawyer of their choice, and the right to be presented before a magistrate within 24 hours of the arrest.",
    "You need to draft a formal legal notice stating the overdue rent amount, the property details, and a clear deadline (e.g., 15 days) to pay the dues. It should be sent via registered post with acknowledgment due."
]


async def generate_dataset():
    """Async: Query Pinecone + Groq to generate the dataset, then save it."""
    print("Setting up RAG Pipeline...")
    bot = ChatBot()

    answers = []
    contexts = []

    print("Generating answers and retrieving contexts (first run — will be cached)...")
    for q in QUESTIONS:
        docs = bot.rag_pipeline.query(q, k=3)
        context_texts = [d.page_content for d in docs]
        if not context_texts:
            context_texts = ["No context retrieved."]
        contexts.append(context_texts)

        context_str = "\n\n".join(context_texts)
        prompt = f"Use the following legal context to answer the question.\n\nContext:\n{context_str}\n\nQuestion: {q}"

        try:
            result = await bot.llm.ainvoke(prompt)
            answer = result.content
        except Exception as e:
            answer = f"Error generating answer: {e}"

        answers.append(answer)
        print(f"Q: {q}")
        print(f"A: {answer[:80]}...\n")

    dataset = {
        "question": QUESTIONS,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": GROUND_TRUTHS
    }
    with open(DATASET_CACHE, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    print(f"Dataset saved to {DATASET_CACHE.name} for future runs.\n")
    return dataset


def load_or_generate_dataset():
    """Sync entry point: load from cache or run async generation."""
    if DATASET_CACHE.exists():
        print(f"Loading cached dataset from {DATASET_CACHE.name}...")
        with open(DATASET_CACHE, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        # Run async generation in its own event loop, then close it
        return asyncio.run(generate_dataset())


def main():
    import logging
    logging.getLogger("ragas").setLevel(logging.ERROR)

    # Step 1: Load or generate dataset (event loop is fully closed after this)
    data = load_or_generate_dataset()
    dataset = Dataset.from_dict(data)

    # Step 2: Run Ragas evaluation (synchronously — it manages its own loop)
    print("Running Ragas Evaluation with 4 metrics...")
    eval_llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=os.getenv("GROQ_API_KEY"))
    eval_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    try:
        result = evaluate(
            dataset=dataset,
            metrics=[
                context_precision,
                context_recall,
                faithfulness,
                answer_relevancy,
            ],
            llm=eval_llm,
            embeddings=eval_embeddings
        )

        print("\n" + "=" * 50)
        print("RAGAS EVALUATION RESULTS")
        print("=" * 50)
        if hasattr(result, 'items'):
            for key, val in result.items():
                print(f"{key.replace('_', ' ').title()}: {val:.4f}")
        else:
            print(result)
        print("=" * 50)

    except Exception as e:
        print(f"Evaluation failed: {e}")


if __name__ == "__main__":
    main()

