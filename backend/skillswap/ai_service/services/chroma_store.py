import chromadb
from chromadb.config import Settings
from .embedding import resume_embedding

client = chromadb.Client(Settings(
    persist_directory='./chromadb',
    is_persistent=True
))

collection = client.get_or_create_collection(name='resume')


def add_vector(chunks, application_id):
    ids = []
    documents = []
    metadatas = []

    embeddings = resume_embedding(chunks)

    for i, chunk in enumerate(chunks):
        ids.append(f"{application_id}_{i}")
        documents.append(chunk)
        metadatas.append({
            'application_id': str(application_id)
        })

    collection.add(
        ids=ids,
        embeddings=embeddings.tolist(),
        documents=documents,
        metadatas=metadatas,
    )


def searchs(job_desc, k=5):
    """
    Search relevant chunks globally (better RAG)
    """
    query_embedding = resume_embedding([job_desc])[0].tolist()

    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=k
    )

    docs = result.get("documents", [])

    if not docs or not docs[0]:
        return []

    return docs[0]


def delete_application_vectors(application_id):
    collection.delete(where={
        "application_id": str(application_id)
    })