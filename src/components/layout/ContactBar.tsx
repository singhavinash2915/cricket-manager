import { Phone, Mail, Instagram } from 'lucide-react';
import { useClub } from '../../context/ClubContext';

export function ContactBar() {
  const { club } = useClub();

  // Don't show the contact bar if club has no phone and no email
  if (!club?.phone && !club?.email) return null;

  return (
    <div className="bg-primary-600 dark:bg-primary-700 text-white py-2 px-4">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
        {club?.phone && (
          <a
            href={`tel:${club.phone}`}
            className="flex items-center gap-1.5 hover:text-primary-100 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{club.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>
        )}
        {club?.email && (
          <a
            href={`mailto:${club.email}`}
            className="flex items-center gap-1.5 hover:text-primary-100 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{club.email}</span>
            <span className="sm:hidden">Email</span>
          </a>
        )}
        {club?.instagram_url && (
          <a
            href={club.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary-100 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
        )}
      </div>
    </div>
  );
}
