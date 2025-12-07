export function generateEmailTemplate(rfps) {
  const rfpList = Array.isArray(rfps) ? rfps : [rfps];

  let html = `
    <div style="font-family: Arial; padding: 20px; color: #333;">
      <h2>New RFP Requirement</h2>
      <p>Dear Vendor,</p>
      <p>You have been invited to submit a proposal for the following request(s):</p>
  `;

  rfpList.forEach((rfp) => {
    const { title, structuredData = {} } = rfp;
    const { products = [], budget, timeline, additionalNotes } = structuredData;

    html += `
      <div style="border: 1px solid #ddd; margin-top: 20px; padding: 15px; border-radius: 8px;">
        <h3 style="margin-bottom: 10px;">${title}</h3>

        <h4>Products Required:</h4>
        <ul>
    `;

    products.forEach((p) => {
      const plainSpecs =
        p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {};

      html += `
        <li>
          <strong>${p.name}</strong> — Qty: ${p.quantity}
          <br/>
          Specs:
          <ul>
            ${Object.entries(plainSpecs)
              .map(([key, value]) => `<li>${key}: ${value}</li>`)
              .join("")}
          </ul>
        </li>
      `;
    });

    html += `
        </ul>

        <p><strong>Budget:</strong> ${
          budget ? `₹${budget}` : "Not specified"
        }</p>
        <p><strong>Timeline:</strong> ${timeline || "Not provided"}</p>
        ${
          additionalNotes
            ? `<p><strong>Additional Notes:</strong> ${additionalNotes}</p>`
            : ""
        }
      </div>
    `;
  });

  html += `
      <p>Please respond with your best quotation at the earliest.</p>
      <p>Regards,<br/>AI-Powered RFP Management System</p>
    </div>
  `;

  return html;
}
