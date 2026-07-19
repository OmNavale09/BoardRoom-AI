from members.base_member import BaseMember

from prompts.cto_prompt import CTO_PROMPT
from schemas.response import AgentResponse


class CTO(BaseMember):

    def __init__(self):
        super().__init__(CTO_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the CTO.

Evaluate the startup from a technical perspective.

Focus on:
- Architecture
- Scalability
- Code Quality
- Technical Risks
- Engineering Feasibility
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} only if there are
technical disagreements.

Be respectful and support your arguments with
engineering reasoning.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply to the challenge.

If the other member has a valid technical point,
update your opinion.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the CTO's perspective.
"""
        )

    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the CTO.

Choose one of:
- Approve
- Approve with Conditions
- Reject

Briefly justify your decision from a technical perspective.

Focus on:
- Architecture
- Scalability
- Maintainability
- Technical risks
- Engineering feasibility

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )