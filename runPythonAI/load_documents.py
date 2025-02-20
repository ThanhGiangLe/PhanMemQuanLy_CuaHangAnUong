import os
import pdfplumber
from docx import Document

def read_txt(file_path):
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
            if current_doc:
                documents.append(current_doc.strip())
            current_doc = line  # Bắt đầu quy trình mới
        else:
            current_doc += "\n" + line

    if current_doc:
        documents.append(current_doc.strip())

    return documents

def read_pdf(file_path):
    """ Đọc file .pdf và nhóm nội dung theo từng quy trình """
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"

    return split_into_sections(text)  # Chia nhỏ nội dung

def read_docx(file_path):
    """ Đọc file .docx và nhóm nội dung theo từng quy trình """
    text = "\n".join([para.text for para in Document(file_path).paragraphs])
    return split_into_sections(text)  # Chia nhỏ nội dung

def split_into_sections(text):
    """ Chia văn bản thành các phần tử nhỏ giống như load_text_file """
    lines = text.split("\n")
    documents = []
    current_doc = ""

    for line in lines:
        line = line.strip()
        if line.startswith("==>"):
            if current_doc:
                documents.append(current_doc.strip())
            current_doc = line  # Bắt đầu quy trình mới
        else:
            current_doc += "\n" + line

    if current_doc:
        documents.append(current_doc.strip())

    return documents

def load_documents(folder_path):
    """ Đọc tất cả file từ thư mục và tách thành các đoạn nhỏ """
    documents = []
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if file_name.endswith(".txt"):
            documents.extend(read_txt(file_path))
        elif file_name.endswith(".pdf"):
            documents.extend(read_pdf(file_path))
        elif file_name.endswith(".docx"):
            documents.extend(read_docx(file_path))
    return documents
