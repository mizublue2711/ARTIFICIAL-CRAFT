if (typeof BigInt !== 'undefined') {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

import React from 'react';

export const metadata = {
  title: 'ARTIFICIAL CRAFT // CYBERNETIC AUTOMATION',
  description: 'Robots for Everyone // Cybernetic Automation & 3D Web App Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090B] text-white font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
