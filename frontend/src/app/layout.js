import './globals.css';
import Layout from '@/components/layout/Layout';

export const metadata = {
  title: 'Student Management System',
  description: 'Comprehensive student management platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
