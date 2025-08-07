from googletrans import Translator

translator = Translator()

def translate_text(text: str, dest_language: str = 'en') -> str:
    try:
        translated = translator.translate(text, dest=dest_language)
        return translated.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text 