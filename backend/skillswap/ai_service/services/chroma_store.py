
import faiss
import numpy as np

dimension = 384
index = faiss.IndexFlatL2(dimension)

chunk_store=[]



def add_vector(vector,chunk_text):
    vector = np.array([vector]).astype('float32')
    index.add(vector)
    chunk_store.append(chunk_text)


def searchs(qu):
    query_vector = np.array([query_vector]).astype('float32')
    distances, indices = index.search(query_vector,)

    results = []
    for idx in indices[0]:
        if idx < len(chunk_store):
            results.append(chunk_store[idx])

    return results