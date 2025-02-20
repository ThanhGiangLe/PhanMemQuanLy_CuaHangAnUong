import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from load_documents import load_text_file   # Cập nhật hàm đọc file

# Chọn mô hình ngôn ngữ
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def create_faiss_index(texts):
    """ Chuyển đổi văn bản thành vector và lưu vào FAISS """
    vectors = model.encode(texts)  # Encode từng đoạn quy trình
    index = faiss.IndexFlatL2(vectors.shape[1])  # Tạo FAISS Index
    index.add(np.array(vectors))  # Thêm vector vào FAISS
    return index, texts

# Đọc tài liệu từ file quy trình
documents = load_text_file("documents/quy_trinh.txt")  # Chỉ load file này

# Tạo FAISS index từ nội dung
index, doc_texts = create_faiss_index(documents)

# Lưu index để sử dụng sau
faiss.write_index(index, "faiss_index.bin")
