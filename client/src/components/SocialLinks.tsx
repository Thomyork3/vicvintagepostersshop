import { Instagram, MessageCircle } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

interface SocialLinksProps {
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
}

export function SocialLinks({
  instagram = "https://instagram.com",
  tiktok = "https://tiktok.com",
  whatsapp
}: SocialLinksProps) {
  return (
    <div className="flex items-center gap-4">
      <a
        href={instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
        title="Instagram"
      >
        <Instagram className="w-5 h-5" />
      </a>

      <a
        href={tiktok}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
        title="TikTok"
      >
        <TikTokIcon className="w-5 h-5" />
      </a>

      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
          title="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
