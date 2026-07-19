from members.chairperson import Chairperson
from members.investor import Investor
from members.cto import CTO
from members.product import ProductUX
from members.marketing import Marketing
from members.security import Security
from members.customer import Customer
from members.devil import DevilsAdvocate
from schemas.response import Message

class MeetingAgent:

    def __init__(self):

        self.chairperson = Chairperson()

        self.members = {
            "Investor": Investor(),
            "CTO": CTO(),
            "ProductUX": ProductUX(),
            "Marketing": Marketing(),
            "Security": Security(),
            "Customer": Customer(),
            "DevilsAdvocate": DevilsAdvocate(),
        }

        self.action_map = {
            "speak": "speak",
            "challenge": "challenge",
            "reply": "reply",
            "reply_to_user": "reply_to_user",
            "vote": "vote",
        }

    async def handle(self, request):

        action = request.action

        # ==================================================
        # Chairperson Actions
        # ==================================================

        if action == "start":
            decision = await self.chairperson.start(request)
            return {
                "message": {
                    "agent": "Chairperson",
                    "type": "announcement",
                    "content": decision.message,
                    "replyTo": None,
                    "confidence": None,
                    "metadata": {}
                },
                "nextDecision": {
                   "action": "speak",
                   "nextSpeaker": decision.nextSpeaker,
                   "target": decision.target,
                   "reason": decision.reason
               }
            }

        elif action == "decide_next":
            return await self.chairperson.decide_next(request)

        elif action == "vote":
            decision = await self.chairperson.start_voting(request)
            return {
        "message": {
            "agent": "Chairperson",
            "type": "announcement",
            "content": decision.message,
            "replyTo": None,
            "confidence": None,
            "metadata": {}
        },
        "nextDecision": {
            "action": decision.action,
            "nextSpeaker": decision.nextSpeaker,
            "target": decision.target,
            "reason": decision.reason
        }
            }

        elif action == "summary":
            return await self.chairperson.summary(request)

        elif action == "user_message":
            return await self.chairperson.handle_user_message(request)

        # ==================================================
        # Meeting Controls
        # ==================================================

        elif action == "pause":
            return {
                "status": "paused",
                "message": "Meeting paused successfully."
            }

        elif action == "resume":
            return {
                "status": "resumed",
                "message": "Meeting resumed successfully."
            }

        elif action == "stop":
            return {
                "status": "stopped",
                "message": "Meeting stopped successfully."
            }

        # ==================================================
        # Board Member Turn
        # ==================================================

        elif action == "member_response":

            if request.decision is None:
                raise ValueError("decision is required.")

            member_name = request.decision.nextSpeaker

            if member_name is None:
                raise ValueError("nextSpeaker is missing in decision.")

            if member_name not in self.members:
                raise ValueError(f"Unknown member: {member_name}")

            member_action = request.decision.action

            if member_action not in self.action_map:
                raise ValueError(
                    f"Unsupported member action: {member_action}"
                )

            member = self.members[member_name]

            method = getattr(
                member,
                self.action_map[member_action]
            )

            # -----------------------------
            # Generate member response
            # -----------------------------

            member_message = await method(
                request=request,
                decision=request.decision
            )

            # -----------------------------
            # Update conversation
            # -----------------------------

            updated_request = request.model_copy(
                update={
                    "messages": request.messages + [
                        Message(**member_message.model_dump())
                    ]
                }
            )

            # -----------------------------
            # Chairperson decides next turn
            # -----------------------------

            next_decision = await self.chairperson.decide_next(
                updated_request
            )

            return {
                "message": member_message.model_dump(),
                "nextDecision": next_decision.model_dump()
            }

        # ==================================================
        # Unknown Action
        # ==================================================

        raise ValueError(f"Unknown action: {action}")