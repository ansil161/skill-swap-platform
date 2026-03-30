
from sentence_transformers import SentenceTransformer

a=SentenceTransformer('all-MiniLM-L6-v2')
def resume_embedding(text):
    return a.encode(text)


