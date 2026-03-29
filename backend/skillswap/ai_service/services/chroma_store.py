import chromadb
from chromadb.config import Settings
from .embedding import resume_embedding

client=chromadb.Client(Settings(
    persist_directory='./chromadb'

))
collection=client.get_or_create_collection(name='rseume')
def add_vector(vector,application_id):
    id = []
    embedding = []
    document= []
    metadata = []
    for i ,chunk in enumerate(vector):
        id.append(f"{application_id },{i}")
        embedding.append(resume_embedding(chunk).tolist)
        document.append(chunk)
        metadata.append({'applicationid':application_id})

    collection.add(
        id=id,
        embeddings=embedding,
        documents=document,
        metadatas=metadata,

    )



 


def searchs(job_des,application_id,k=5):
    filter_embedding=resume_embedding(job_des).tolist()

    result=collection.query(
        query_embeddings=[filter_embedding],
        result=k,
        where={'application_id':application_id}
    )

    return result['document'][0]
