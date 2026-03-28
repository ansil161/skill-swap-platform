import pdfplumber

def resume_parse(file):
    text=''
    with pdfplumber.open(file) as  pdf:
        for page in pdf.pages:
            text+=page.extract_text() or ''
    return text
    
