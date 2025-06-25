
import React, { useState } from 'react';
import { APP_NAME } from '../constants';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend.
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
     setTimeout(() => setIsSubmitted(false), 5000); // Reset message after 5s
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary-700 dark:text-primary-300">Hubungi Kami</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Informasi Kontak</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>{APP_NAME}</strong>
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Jl. Pesantren No. 1, Bungah<br />
            Gresik, Jawa Timur, 61152<br />
            Indonesia
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Email:</strong> <a href="mailto:info@tppkpqomaruddin.org" className="text-primary-600 hover:underline dark:text-primary-400">info@tppkpqomaruddin.org</a>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Telepon:</strong> +62 31 123 4567
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Jam Operasional (Offline)</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Senin - Jumat: 08:00 - 16:00 WIB<br />
            Sabtu: 08:00 - 12:00 WIB<br />
            Minggu & Hari Libur Nasional: Tutup
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Kirim Pesan</h2>
        {isSubmitted && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 rounded-md">
            Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required 
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pesan Anda</label>
            <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required 
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"></textarea>
          </div>
          <div>
            <button type="submit" 
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Kirim Pesan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
