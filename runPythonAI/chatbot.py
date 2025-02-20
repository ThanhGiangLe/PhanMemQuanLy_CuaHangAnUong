import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from load_documents import load_documents  

# Load model và FAISS index
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
index = faiss.read_index("faiss_index.bin")
documents = load_documents("documents/")

# Hàm lấy câu trả lời cho API
def get_answer(question):
    query_vector = model.encode([question])
    distances, indices = index.search(np.array(query_vector), 1)

    best_match_idx = indices[0][0]
    best_distance = distances[0][0]

    # Debug: Xem chỉ số FAISS chọn
    print(f"🔍 Câu hỏi: {question}")
    print(f"📌 Best match index: {best_match_idx}, Distance: {best_distance}")
    print(f"📖 Nội dung tìm thấy: {documents[best_match_idx][:100]}...\n")

    # Kiểm tra nếu câu hỏi không đủ độ chính xác
    THRESHOLD = 5  # Điều chỉnh ngưỡng tìm kiếm
    if best_match_idx < 0 or best_distance > THRESHOLD:
        return (
            "🤖 Xin lỗi, tôi chưa có thông tin về câu hỏi này. "
            "Bạn có thể thử hỏi lại hoặc liên hệ hỗ trợ khách hàng."
        )

    return documents[best_match_idx]
