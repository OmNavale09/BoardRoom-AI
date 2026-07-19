from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


# ==========================================================
# Shared Types
# ==========================================================

AgentName = Literal[
    "Chairperson",
    "Investor",
    "CTO",
    "ProductUX",
    "Marketing",
    "Security",
    "Customer",
    "DevilsAdvocate",
    "User",
]

MessageType = Literal[
    "announcement",
    "speaking",
    "challenge",
    "reply",
    "summary",
    "vote"
]
# ==========================================================
# Attachment
# ==========================================================

class Attachment(BaseModel):
    type: Literal["pdf", "ppt", "image"]

    title: str

    url: str

# ==========================================================
# Conversation Message
# ==========================================================

class Message(BaseModel):

    agent: AgentName

    type: MessageType

    content: str

    github: Optional[str] = None

    attachment: Optional[Attachment] = None

# ==========================================================
# Meeting
# ==========================================================

class Meeting(BaseModel):

    id: str

    title: str

    status: str


# ==========================================================
# Project
# ==========================================================

class Project(BaseModel):

    id: str

    title: str

    description: str

    stage: Optional[str] = None

    category: Optional[str] = None


# ==========================================================
# Chairperson Decision
# ==========================================================

class ChairpersonDecision(BaseModel):

    action: Literal[
        "announcement",
        "speak",
        "challenge",
        "reply",
        "reply_to_user",
        "vote",
        "summary",
        "end",
    ]

    nextSpeaker: Optional[AgentName] = None

    target: Optional[AgentName] = None

    message: Optional[str] = None

    reason: str


# ==========================================================
# Request Model
# ==========================================================

class MeetingRequest(BaseModel):

    action: Literal[
        "start",
        "decide_next",
        "member_response",
        "user_message",
        "vote",
        "summary",
        "pause",
        "resume",
        "stop",
    ]

    meeting: Meeting

    project: Project

    messages: list[Message]

    decision: Optional[ChairpersonDecision] = None


# ==========================================================
# AI Member Response
# ==========================================================

class AgentResponse(BaseModel):

    agent: AgentName

    type: MessageType

    content: str

    replyTo: Optional[str] = None

    confidence: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
    )

    metadata: dict[str, Any] = Field(default_factory=dict)


MeetingRequest.model_rebuild()
