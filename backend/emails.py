"""Branded confirmation emails sent to contact-form submitters.

Email-client constraints drive every choice here: table layout, fully
inline CSS (no <style>, no webfonts — system font stacks only), absolute
image URLs, and a plain-text alternative for every send. No tracking
pixels.
"""

import html

SITE_URL = "https://kedbyte.com"
LOGO_URL = f"{SITE_URL}/images/email-logo.png"

# System stacks — never webfonts.
BODY_FONT = "Helvetica, Arial, sans-serif"
MONO_FONT = "'Courier New', Courier, monospace"

GENERAL_SUBJECT = "We've received your message — Kedbyte"
PAYROLL_SUBJECT = "You're on the Kedbyte Payroll early-access list"

# CLAIMS POLICY (payroll copy): recognition is only ever "in progress";
# no launch dates; no feature promises beyond the payroll page.
_GENERAL = {
    "headline": "We've received your message",
    "body": (
        "Thanks for getting in touch with Kedbyte. Your message has landed "
        "safely with our team, and a real person will reply within 24 hours."
    ),
}
_PAYROLL = {
    "headline": "You're on the early-access list",
    "body": (
        "Thanks for your interest in Kedbyte Payroll — your spot on the "
        "early-access list is confirmed. We'll email you when there's news "
        "on launch timing and on our progress toward HMRC PAYE recognition."
    ),
}


def _first_name(name: str) -> str:
    parts = (name or "").strip().split()
    return parts[0] if parts else "there"


def _summary_rows_html(name: str, company: str, message: str) -> str:
    rows = [("Name", name)]
    if (company or "").strip():
        rows.append(("Company", company))
    rows.append(("Message", message))
    out = []
    for label, value in rows:
        out.append(
            f'<tr><td style="padding:2px 0;font-family:{MONO_FONT};font-size:12px;'
            f'line-height:20px;color:#71717A;vertical-align:top;white-space:nowrap;">'
            f"{html.escape(label)}&nbsp;&nbsp;</td>"
            f'<td style="padding:2px 0;font-family:{MONO_FONT};font-size:12px;'
            f'line-height:20px;color:#27272A;">{html.escape(value)}</td></tr>'
        )
    return "".join(out)


def build_confirmation_email(*, name: str, company: str, message: str, source: str) -> dict:
    """Return {"subject", "html", "text"} for the submitter confirmation."""
    variant = _PAYROLL if source == "payroll-early-access" else _GENERAL
    subject = PAYROLL_SUBJECT if source == "payroll-early-access" else GENERAL_SUBJECT
    first = html.escape(_first_name(name))

    html_body = f"""\
<!doctype html>
<html>
<body style="margin:0;padding:0;background-color:#F4F4F5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F4F5;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:36px 40px 0;">
              <img src="{LOGO_URL}" width="60" height="60" alt="Kedbyte" style="display:block;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0;">
              <div style="height:2px;width:56px;background-color:#00F0FF;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 0;">
              <h1 style="margin:0;font-family:{BODY_FONT};font-size:24px;line-height:32px;font-weight:700;color:#09090B;">{variant["headline"]}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px 0;">
              <p style="margin:0;font-family:{BODY_FONT};font-size:15px;line-height:24px;color:#3F3F46;">Hi {first},</p>
              <p style="margin:12px 0 0;font-family:{BODY_FONT};font-size:15px;line-height:24px;color:#3F3F46;">{variant["body"]}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAFAFA;border:1px solid #E4E4E7;border-radius:8px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;font-family:{MONO_FONT};font-size:11px;line-height:16px;letter-spacing:2px;color:#A1A1AA;">YOUR SUBMISSION</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      {_summary_rows_html(name, company, message)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 36px;">
              <p style="margin:0;font-family:{BODY_FONT};font-size:13px;line-height:20px;color:#A1A1AA;">If you didn't submit this, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:#09090B;">
              <p style="margin:0;font-family:{BODY_FONT};font-size:14px;font-weight:700;letter-spacing:3px;color:#FFFFFF;">KED<span style="color:#00F0FF;">BYTE</span></p>
              <p style="margin:8px 0 0;font-family:{BODY_FONT};font-size:12px;line-height:18px;color:#A1A1AA;">
                <a href="{SITE_URL}" style="color:#A1A1AA;text-decoration:underline;">kedbyte.com</a><br />
                Kedbyte Private Limited &middot; Vadodara, Gujarat, India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    text_lines = [
        variant["headline"],
        "",
        f"Hi {_first_name(name)},",
        "",
        variant["body"],
        "",
        "Your submission",
        "---------------",
        f"Name: {name}",
    ]
    if (company or "").strip():
        text_lines.append(f"Company: {company}")
    text_lines += [
        f"Message: {message}",
        "",
        "If you didn't submit this, you can safely ignore this email.",
        "",
        "KEDBYTE",
        SITE_URL,
        "Kedbyte Private Limited · Vadodara, Gujarat, India",
    ]

    return {"subject": subject, "html": html_body, "text": "\n".join(text_lines)}
