from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def resume_embedding(texts):
   
    return model.encode(texts)