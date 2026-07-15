from langchain_core.tools import tool, BaseTool
import inspect  

class MathTools:
    """Collection of basic math tools."""

    @staticmethod
    @tool
    async def add_numbers(a: float, b: float) -> float:
        """Add two numbers."""
        return float(a) + float(b)

    @staticmethod
    @tool
    async def multiply_numbers(a: float, b: float) -> float:
        """Multiply two numbers."""
        return float(a) * float(b)

    @staticmethod
    @tool
    async def divide_numbers(a: float, b: float) -> float:
        """Divide two numbers. Raises error if b is zero."""
        a = float(a)
        b = float(b)
        if b == 0:
            raise ValueError("Cannot divide by zero.")
        return a / b

    @staticmethod
    @tool
    async def subtract_numbers(a: float, b: float) -> float:
        """Subtract second number from the first number."""
        return float(a) - float(b)

    @staticmethod
    @tool
    async def final_answer(answer: str) -> str:
        """Use this tool to give the final answer to the user. 
        Always call this at the end instead of repeating other tools.
        make sure the answer is in a complete sentence. and not json format."""
        return answer
    
    @staticmethod
    @tool
    def request_user_clarification(questions: list[str], reason: str) -> str:
        """
        Call this tool when you need more facts from the user before providing legal advice.
        Args:
            questions: A list of 3-5 specific questions (e.g. ["Which province?", "Do you have the FIR?"])
            reason: Why you need this information
        """
        import json
        return f"STOP_AND_ASK:{json.dumps({'reason': reason, 'questions': questions})}"

    @staticmethod
    @tool
    def generate_legal_document(document_type: str, content: str) -> str:
        """
        Call this tool when you have gathered all necessary facts and are ready to draft a legal document for the user.
        Args:
            document_type: The type of document (e.g. "FIR Application", "Legal Notice", "Rental Agreement")
            content: The full drafted text of the document in markdown format. Ensure it looks professional.
        """
        import json
        return f"DOCUMENT_DRAFT:{json.dumps({'type': document_type, 'content': content})}"

    @classmethod
    def get_tools(cls):
        """Return all @tool-decorated callables from this class."""
        tools = []
        for name, member in inspect.getmembers(cls):
            if isinstance(member, BaseTool):
                tools.append(member)
        return tools

    @classmethod
    def get_retrieval_tool(cls, rag_pipeline):
        """
        Dynamically create a retrieval tool that uses the given RAG pipeline.
        The tool docstring instructs the LLM to rephrase user queries.
        """
        @tool
        def search_legal_context(search_query: str) -> str:
            """
            Use this tool to search the legal database (Constitution, Penal Code, etc.) for factual information.
            Do not pass the raw conversational question from the user. Instead, rephrase the user's query into 
            an optimized, keyword-rich search query. 
            You may call this tool multiple times if the first search does not yield sufficient information.
            """
            print(f"\\n[Tool Calling] Searching for: '{search_query}'")
            # We use k=5 to give the LLM enough context per search
            docs = rag_pipeline.query(search_query, k=5)
            
            if not docs:
                return "No relevant documents found. Try refining your search query."
            
            context = "\\n\\n".join(
                f"Source: {d.metadata.get('source', 'Unknown')} | Article/Section: {d.metadata.get('article', d.metadata.get('section', 'N/A'))}\\nContent: {d.page_content}"
                for d in docs
            )
            return f"Retrieved Context:\\n{context}"
            
        return search_legal_context



if __name__ == "__main__":
    math_tools = MathTools()
    print("hello")
    print(MathTools.get_tools())