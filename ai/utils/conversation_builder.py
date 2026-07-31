class ConversationBuilder:

    @staticmethod
    def build(messages) -> str:

        if not messages:
            return "No discussion has taken place yet."

        history = []

        for msg in messages:

            line = f"{msg.agent}"

            if msg.type == "challenge":
                line += " (Challenge)"

            elif msg.type == "reply":
                line += " (Reply)"

            elif msg.type == "vote":
                line += " (Vote)"

            elif msg.type == "summary":
                line += " (Summary)"

            elif msg.type == "announcement":
                line += " (Announcement)"

            line += f":\n{msg.content}"

            history.append(line)

        return "\n\n".join(history)