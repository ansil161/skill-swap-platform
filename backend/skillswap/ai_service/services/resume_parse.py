import pdfplumber

def resume_parse(file_obj):
    text = ""

    with pdfplumber.open(file_obj) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text