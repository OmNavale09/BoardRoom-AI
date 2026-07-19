from members.base_member import BaseMember

from prompts.devil_prompt import DEVIL_PROMPT
from schemas.response import AgentResponse


class DevilsAdvocate(BaseMember):

    def __init__(self):
        super().__init__(DEVIL_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the Devil's Advocate.

Identify:
- Hidden Risks
- Weak Assumptions
- Failure Scenarios
- Blind Spots
- Worst-Case Outcomes

Challenge the consensus constructively.
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} by questioning assumptions and highlighting overlooked risks.

Be critical but constructive.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply while maintaining a skeptical perspective.

Accept stronger evidence when it addresses your concerns.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Devil's Advocate perspective.
"""
        )
    
    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Advocate.

Choose one of:
- Approve
- Approve with Conditions
- Reject

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )