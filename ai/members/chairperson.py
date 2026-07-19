from members.base_member import BaseMember

from prompts.chairperson_prompt import CHAIRPERSON_PROMPT
from schemas.response import ChairpersonDecision


class Chairperson(BaseMember):

    VOTING_ORDER = [
        "Investor",
        "CTO",
        "ProductUX",
        "Marketing",
        "Security",
        "Customer",
        "DevilsAdvocate"
    ]

    def __init__(self):
        super().__init__(CHAIRPERSON_PROMPT)

    async def start(self, request):
        return await self.generate(
            request,
            ChairpersonDecision,
            """
The meeting has just started.

Generate the opening announcement.

Then decide who should speak first.
"""
        )

    async def decide_next(self, request):

        # -----------------------------------------
        # Voting flow (handled in code)
        # -----------------------------------------

        votes = [
            m for m in request.messages
                if m.type == "vote"
        ]

        if votes:

            voted_members = [
                m.agent for m in votes
            ]

            for member in self.VOTING_ORDER:
                if member not in voted_members:
                    return ChairpersonDecision(
                        action="vote",
                        nextSpeaker=member,
                        target=None,
                        reason=f"{member} has not voted yet."
                    )

            return ChairpersonDecision(
                action="summary",
                nextSpeaker=None,
                target=None,
                reason="All members have voted."
            )

        # -----------------------------------------
        # Normal discussion
        # -----------------------------------------

        return await self.generate(
            request,
            ChairpersonDecision,
            """
Analyze the complete discussion.

Choose ONLY ONE next action.

Possible actions:

- speak
- challenge
- reply
- vote
- summary
- end

Return valid JSON only.
"""
        )

    async def handle_user_message(self, request):
        return await self.generate(
            request,
            ChairpersonDecision,
            """
The user has asked a question.

Choose which board member should answer.
"""
        )

    async def start_voting(self, request):

        return ChairpersonDecision(
            message="The discussion has concluded. We will now begin the voting phase. Investor, please cast your vote first.",
            action="vote",
            nextSpeaker="Investor",
            target=None,
            reason="Voting begins with Investor."
        )

    async def summary(self, request):
        return await self.generate(
            request,
            ChairpersonDecision,
            """
Generate the final meeting summary and conclude the meeting.
"""
        )