from members.base_member import BaseMember

from prompts.investor_prompt import INVESTOR_PROMPT
from schemas.response import AgentResponse


class Investor(BaseMember):

    def __init__(self):
        super().__init__(INVESTOR_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the Investor.

Evaluate the startup focusing on:
- Market Opportunity
- Business Model
- Revenue Potential
- Competition
- Scalability
- Investment Readiness
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} only if you disagree from an investment perspective.

Support your argument with logical business reasoning.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply professionally.

Update your opinion if new evidence changes your investment assessment.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Investor's perspective.
"""
        )
    
    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Investor.

Choose one of:
- Approve
- Approve with Conditions
- Reject

Briefly justify your decision from a investor perspective.

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )