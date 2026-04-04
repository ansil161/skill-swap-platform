from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')



def resume_embedding(chunks):
    try:
        if isinstance(chunks, str):
            chunks = [chunks]
            
     
        embeddings = model.encode(chunks, convert_to_numpy=True)
        return embeddings.tolist() 
    except Exception as e:
        print(f"Embedding Error: {e}")
        return []