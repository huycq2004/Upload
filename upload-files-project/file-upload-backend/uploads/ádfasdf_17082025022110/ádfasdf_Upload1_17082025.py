from pypdf import PdfReader, PdfWriter

def extract_pages(input_pdf, output_pdf, start_page, end_page):
    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    # Trích trang từ start_page đến end_page (đếm từ 0)
    for i in range(start_page, end_page + 1):
        writer.add_page(reader.pages[i])

    with open(output_pdf, "wb") as f:
        writer.write(f)

# Ví dụ: Tách trang 1 đến 4 (tức index 0 đến 3)
extract_pages("Set_Math_Test_1.pdf", "Set_Math_Test_1\THPT Bình Xuyên(Đáp án).pdf",165, 172)
