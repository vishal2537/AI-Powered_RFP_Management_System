export async function extractPdfText(buffer) {
    const pdf = (await import("pdf-parse")).default;
    const data = await pdf(buffer);
    return data.text;
}