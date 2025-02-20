import os
import pdfplumber
from docx import Document

def read_txt(file_path):
    """ Đọc file .txt """
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def read_pdf(file_path):
    """ Đọc file .pdf """
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def read_docx(file_path):
    """ Đọc file .docx """
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def load_documents(folder_path):
    """ Đọc tất cả file trong thư mục và trả về danh sách văn bản """
    documents = []
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if file_name.endswith(".txt"):
            documents.append(read_txt(file_path))
        elif file_name.endswith(".pdf"):
            documents.append(read_pdf(file_path))
        elif file_name.endswith(".docx"):
            documents.append(read_docx(file_path))
    return documents

def load_text_file(file_path):
    """ Đọc file .txt và nhóm nội dung theo từng quy trình """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    documents = []
    current_doc = ""

    for line in lines:
        line = line.strip()
        if line.startswith("==>"):  # Nếu gặp tiêu đề mới
            if current_doc:  # Lưu phần trước đó
                documents.append(current_doc.strip())
            current_doc = line  # Bắt đầu quy trình mới
        else:
            current_doc += "\n" + line  # Nối vào nội dung quy trình

    if current_doc:  # Lưu phần cuối cùng
        documents.append(current_doc.strip())

    return documents