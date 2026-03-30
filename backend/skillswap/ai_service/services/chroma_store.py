import chromadb
from chromadb.config import Settings
from .embedding import resume_embedding

client=chromadb.Client(Settings(
    persist_directory='./chromadb',
    is_persistent=True

))
collection=client.get_or_create_collection(name='resume')
def add_vector(vector,application_id):
    id = []
    embedding = []
    document= []
    metadata = []
    for i ,chunk in enumerate(vector):
        id.append(f"{application_id }_{i}")
        embedding.append(resume_embedding(chunk).tolist())
        document.append(chunk)
        metadata.append({'application_id': application_id})

    collection.add(
        ids=id,
        embeddings=embedding,
        documents=document,
        metadatas=metadata,

    )



 


def searchs(job_des,application_id,k=5):
    filter_embedding=resume_embedding(job_des).tolist()

    result=collection.query(
        query_embeddings=[filter_embedding],
        n_results=k,
        where={'application_id':application_id}
    )

    return result['documents'][0]
