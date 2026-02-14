import re

def clean_whatsapp_chat(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as file:
        lines = file.readlines()

    cleaned_messages = []

    for line in lines:
        # Remove invisible characters
        line = line.replace("\u200e", "").strip()

        # Skip unwanted system lines
        if "end-to-end encrypted" in line:
            continue
        if "is a contact" in line:
            continue
        if "image omitted" in line.lower():
            continue

        # Remove edited tag
        line = re.sub(r"<This message was edited>", "", line)

        # Match WhatsApp message pattern
        match = re.match(r"\[(.*?)\]\s(.*?):\s(.*)", line)

        if match:
            name = match.group(2)
            message = match.group(3)

            cleaned_line = f"{name}: {message}"
            cleaned_messages.append(cleaned_line)

    with open(output_file, "w", encoding="utf-8") as file:
        for msg in cleaned_messages:
            file.write(msg + "\n")

    print("Chat cleaned successfully!")

# Usage
input_path = "_chat.txt"
output_path = "clean_chat.txt"

clean_whatsapp_chat(input_path, output_path)
