"""Transactional email. Swap the transport for SES/SendGrid/Postmark; keep templates plain and accessible."""
import logging
import smtplib
from email.message import EmailMessage

from ..config import get_settings

log = logging.getLogger("udaan.mail")


def send_email(to: str, subject: str, text: str, attachment: tuple[str, bytes, str] | None = None) -> None:
    s = get_settings()
    if not s.smtp_host:
        log.info("Email not sent (SMTP not configured): to=%s subject=%s", to, subject)
        return
    msg = EmailMessage()
    msg["From"], msg["To"], msg["Subject"] = s.mail_from, to, subject
    msg.set_content(text)
    if attachment:
        name, data, mime = attachment
        maintype, subtype = mime.split("/")
        msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=name)
    with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=20) as smtp:
        smtp.starttls()
        if s.smtp_user:
            smtp.login(s.smtp_user, s.smtp_password)
        smtp.send_message(msg)


def donation_confirmation(to: str, name: str, reference: str, amount: int, cause: str, receipt_no: str | None) -> None:
    send_email(
        to, f"Thank you for your donation ({reference})",
        f"Dear {name},\n\nThank you for your donation of Rs {amount:,} to {cause}.\n"
        f"Donation reference: {reference}\nReceipt number: {receipt_no or 'will follow'}\n\n"
        "Keep this email for your records.\n\nShivshristi Seva Sansthan",
    )
