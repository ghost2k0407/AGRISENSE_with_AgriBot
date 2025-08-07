def build_structured_prompt(prediction, similar_images, language="en"):
    disease = prediction["label"]
    confidence = prediction["confidence"]
    sim_list = "\n".join([f"- {img}" for img in similar_images])

    language_instruction = {
        "en": "",
        "ta": "Respond in Tamil.",
        "te": "Respond in Telugu.",
        "kn": "Respond in Kannada.",
        "ml": "Respond in Malayalam."
    }

    prompt = f"""
    You are a knowledgeable agricultural assistant.

    The input image was classified with:
    - Disease: {disease}
    - Confidence: {confidence}

    Top 5 similar disease samples from the database:
    {sim_list}

    Please give:
    1. Disease name and symptoms
    2. Causes of the disease
    3. Recommended treatments (chemical + organic)
    4. Prevention tips

    I dont want introductory and gratitude messages at start or end

    {language_instruction.get(language, "")}
    """
    return prompt.strip()

def build_agrobot_prompt(user_message):
    with open("llm/agrobot_rules.txt", "r", encoding="utf-8") as f:
        rules = f.read()

    prompt = f"""{rules}

User asked: "{user_message}"

Reply strictly as per instructions above."""
    return prompt
