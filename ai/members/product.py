from members.base_member import BaseMember

from prompts.product_prompt import PRODUCT_PROMPT
from schemas.response import AgentResponse


class ProductUX(BaseMember):

    def __init__(self):
        super().__init__(PRODUCT_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the Head of Product & UX.

Evaluate:
- User Experience
- Product Design
- Feature Prioritization
- Usability
- Product-Market Fit
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} if their proposal negatively impacts users or product quality.

Provide practical product reasoning.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply from a Product & UX perspective.

Revise your opinion if better user-focused arguments are presented.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Product & UX perspective.
"""
        )

    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Product.

Choose one of:
- Approve
- Approve with Conditions
- Reject

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )