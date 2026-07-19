from members.base_member import BaseMember

from prompts.security_prompt import SECURITY_PROMPT
from schemas.response import AgentResponse


class Security(BaseMember):

    def __init__(self):
        super().__init__(SECURITY_PROMPT)

    async def speak(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Speak as the Security Expert.

Evaluate:
- Data Security
- Authentication
- Authorization
- Privacy
- Compliance
- Security Risks
"""
        )

    async def challenge(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            f"""
Challenge {decision.target} if there are security or privacy concerns.

Support your arguments with security best practices.
"""
        )

    async def reply(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Reply from a security perspective.

Update your assessment if valid security evidence is presented.
"""
        )

    async def reply_to_user(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
Answer the user's latest question from the Security perspective.
"""
        )

    async def vote(self, request, decision):
        return await self.generate(
            request,
            AgentResponse,
            """
You are casting your FINAL vote as the Security.

Choose one of:
- Approve
- Approve with Conditions
- Reject

This is your final vote. Do not ask questions or continue the discussion.
Return only your vote and reasoning.
"""
        )