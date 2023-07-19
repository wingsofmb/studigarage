import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export interface MailToContent {
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  content: string;
}

@Injectable()
export class mailToService {
  constructor(private sanitizer: DomSanitizer) {}

  public send(payload: MailToContent): void {
    const formatedContent = this.format(payload);

    const mailToLink = document.createElement('a');
    mailToLink.href = formatedContent as string;
    mailToLink.click();
    mailToLink.remove();
  }

  private format(payload: MailToContent): string | null {
    const content = payload.content.replace(/\n/g, '%0D%0A');
    const contactEmail = 'studigarage@yopmail.com';
    const body = `Prise de contact : ${payload.subject}%0D%0A%0D%0A
-----%0D%0A
Expéditeur : ${payload.firstName} ${payload.lastName}%0D%0A
Email : ${payload.email}%0D%0A
Tel : ${payload.phone}%0D%0A
------%0D%0A
${content}`;
    return this.sanitizer.sanitize(SecurityContext.URL, `mailto:${contactEmail}?subject=${payload.subject}&body=${body}`);
  }
}
