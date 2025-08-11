export const metadata = {
  title: 'Cliquie - Dating Made Simple',
  description: 'Still consulting ChatGPT to talk to girls? We got you covered.',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}