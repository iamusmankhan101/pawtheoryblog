const PAGES = {
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: 17 November 2026',
    sections: [
      ['Acceptance of terms', 'By accessing or using PawTheory you agree to these Terms of Service. If you do not agree, please do not use the site.'],
      ['Not veterinary advice', 'Articles on PawTheory are written for general information about pets and animal care. They are not a substitute for professional veterinary advice, diagnosis or treatment. Always consult a qualified vet about your animal\'s health, and seek urgent care in an emergency.'],
      ['Content and intellectual property', 'All articles, images and designs on this site belong to PawTheory or its contributors unless stated otherwise. You may share links and short quotations with credit, but you may not copy or republish full articles without written permission.'],
      ['Your use of the site', 'You agree not to misuse the site, attempt to access areas you are not authorised to use, send spam through our forms, or interfere with its operation.'],
      ['Third-party links', 'Articles may link to other websites. We do not control and are not responsible for their content or practices.'],
      ['Limitation of liability', 'PawTheory is provided "as is". To the fullest extent permitted by law, we are not liable for any loss or harm arising from your use of the site or reliance on its content.'],
      ['Changes to these terms', 'We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.'],
      ['Contact', 'Questions about these terms? Reach us through the Contact page.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 17 November 2026',
    sections: [
      ['What we collect', 'We only collect information you choose to give us: your email address when you subscribe to the newsletter, and your name, email and message when you use the contact form.'],
      ['How we use it', 'We use your email to send the newsletter you signed up for, and your contact details to reply to your message. We do not use your information for anything else.'],
      ['Sharing', 'We do not sell or rent your personal data. We use trusted service providers to host the site and store data, and they may process it on our behalf under their own security obligations.'],
      ['Cookies and local storage', 'The site uses only the browser storage needed to run properly and, for administrators, to keep them signed in. We do not use advertising or tracking cookies.'],
      ['Data retention', 'We keep subscriber and contact details only as long as needed for the purposes above, or until you ask us to delete them.'],
      ['Your rights', 'You can ask to see, correct or delete the personal data we hold about you at any time, and you can unsubscribe from the newsletter whenever you like.'],
      ['Children', 'PawTheory is not directed at children under 13, and we do not knowingly collect their personal data.'],
      ['Changes and contact', 'We may update this policy and will change the date above when we do. For any privacy request or question, use the Contact page.'],
    ],
  },
}

export default function Legal({ page }) {
  const { title, updated, sections } = PAGES[page]
  return (
    <div className="article">
      <h1>{title}</h1>
      <p className="muted">{updated}</p>
      {sections.map(([h, t], i) => (
        <section key={h}>
          <h3 style={{ margin: '28px 0 8px' }}>{i + 1}. {h}</h3>
          <p className="body">{t}</p>
        </section>
      ))}
    </div>
  )
}
