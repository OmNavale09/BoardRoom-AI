from members.base_member import BaseMember

from prompts.marketing_prompt import MARKETING_PROMPT
from schemas.response import AgentResponse


class Marketing(BaseMember):

    def __init__(self):
        super().__init__(MARKETING_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the Marketing Head.

Evaluate:
- Branding
- Go-To-Market Strategy
- Customer Acquisition
- Growth Potential
- Positioning
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} if there are weaknesses in marketing strategy or customer acquisition.

Explain your reasoning clearly.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply professionally.

Adjust your marketing opinion if stronger arguments are presented.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Marketing perspective.
"""
        )

    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Marketing.

Choose one of:
- Approve
- Approve with Conditions
- Reject

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )