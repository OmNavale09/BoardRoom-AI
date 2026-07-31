from langchain_core.messages import HumanMessage, SystemMessage
from utils.conversation_builder import ConversationBuilder
from services.gemini import gemini


class BaseMember:

    def __init__(self, prompt: str):
        self.llm = gemini.get_llm()
        self.prompt = prompt

    async def generate(self, request, schema, instruction: str):
        history = ConversationBuilder.build(request.messages)

        structured_llm = self.llm.with_structured_output(schema)

        return await structured_llm.ainvoke([
            SystemMessage(content=self.prompt),
            HumanMessage(
                content=f"""
MEETING

Title:
{request.meeting.title}

Description:
{request.project.description}

Stage:
{request.project.stage or "Not specified"}

Category:
{request.project.category or "Not specified"}

----------------------------------------

DISCUSSION

{history}

----------------------------------------

CURRENT TASK

{instruction}
"""
)
        ])