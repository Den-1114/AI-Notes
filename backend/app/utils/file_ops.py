def extract_text_from_pdf(file_path: str) -> str:
    from PyPDF2 import PdfReader

    reader = PdfReader(file_path)
    return "\n".join(
        [page.extract_text() for page in reader.pages if page.extract_text()]
    )


def extract_text_from_docx(file_path: str) -> str:
    import docx

    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])
