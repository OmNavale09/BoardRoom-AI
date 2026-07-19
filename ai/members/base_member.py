from langchain_core.messages import HumanMessage, SystemMessage

from services.gemini import gemini


class BaseMember:

    def __init__(self, prompt: str):
        self.llm = gemini.get_llm()
        self.prompt = prompt

    async def generate(self, request, schema, instruction: str):

        structured_llm = self.llm.with_structured_output(schema)

        return await structured_llm.ainvoke([
            SystemMessage(content=self.prompt),
            HumanMessage(
                content=f"""
{request.model_dump_json(indent=2)}

{instruction}
"""
            )
        ])