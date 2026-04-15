from sentence_transformers import SentenceTransformer
import os
current_file = os.path.abspath(__file__)
services_dir = os.path.dirname(current_file)
ai_service_dir = os.path.dirname(services_dir)

model_path = os.path.join(ai_service_dir, 'model_weights')



if os.path.exists(model_path):
    model = SentenceTransformer(model_path)
    print(" Loaded model from local weights")
else:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Local weights not found, downloading")





def resume_embedding(chunks):
    try:
        if isinstance(chunks, str):
            chunks = [chunks]
            
     
        embeddings = model.encode(chunks, convert_to_numpy=True)
        return embeddings.tolist() 
    except Exception as e:
        print(f"Embedding Error: {e}")
        return []