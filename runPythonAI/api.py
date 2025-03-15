from flask import Flask, request, jsonify
from chatbot import get_answer  # Hàm lấy câu trả lời từ chatbot
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app, resources={r"/chatbot": {"origins": "*"}})  # Fix lỗi CORS

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        question = data.get("question", "")
        if not question:
            return jsonify({"error": "Vui lòng cung cấp câu hỏi"}), 400  # Trả về lỗi 400 nếu không có câu hỏi

        answer = get_answer(question)  # Gọi chatbot xử lý câu hỏi
        return jsonify({"answer": answer})
    except Exception as e:
        error_message = traceback.format_exc()  # Lấy chi tiết lỗi
        print("🔥 Lỗi hệ thống:", error_message)  # In lỗi ra terminal
        return jsonify({"error": f"Lỗi hệ thống: {str(e)}"}), 500

# Fix lỗi favicon.ico
@app.route('/favicon.ico')
def favicon():
    return '', 204  # Trả về rỗng và mã 204 (No Content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1902, debug=True)
