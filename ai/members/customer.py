from members.base_member import BaseMember

from prompts.customer_prompt import CUSTOMER_PROMPT
from schemas.response import AgentResponse


class Customer(BaseMember):

    def __init__(self):
        super().__init__(CUSTOMER_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as a representative customer.

Evaluate:
- Value Proposition
- Ease of Use
- User Satisfaction
- Pricing Perception
- Likelihood of Adoption
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} if their proposal creates a poor customer experience.

Explain how real users would react.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply from the customer's perspective.

Be honest about whether the discussion changes your opinion.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Customer's perspective.
"""
        )
    
    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Customer.

Choose one of:
- Approve
- Approve with Conditions
- Reject

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )