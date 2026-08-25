import { Link } from 'react-router-dom'; // Changed from 'next/link'
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../../config/site'; // Changed import path to relative
import { Typography } from '../ui/Typography'; // Changed import path to relative

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#1A3C2F] text-[#F4F1E9] py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Column */}
        <div>
          <Typography variant="h3" className="!text-[#F4F1E9] mb-4">
            {siteConfig.shortName}
          </Typography>
          <Typography className="!text-[#F4F1E9]/80 max-w-sm">
            {t('footer.description')}
          </Typography>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-3">
          <Typography variant="h4" className="!text-[#F4F1E9]/50 mb-2 text-sm">{t('footer.navigation')}</Typography>
          {siteConfig.mainNav.map((item) => (
            <Link 
              key={item.href} 
              to={item.href} // Changed href to 'to'
              className="text-[#F4F1E9]/80 hover:text-white transition-colors text-sm font-sans"
            >
              {t(`navigation.${item.key}`)}
            </Link>
          ))}
        </div>

        {/* Contact Column */}
        <div>
          <Typography variant="h4" className="!text-[#F4F1E9]/50 mb-2 text-sm">{t('footer.contact')}</Typography>
          <a 
            href={`mailto:${siteConfig.orgInfo.email}`}
            className="text-[#F4F1E9]/80 hover:text-white transition-colors text-sm font-sans"
          >
            {siteConfig.orgInfo.email}
          </a>
        </div>

      </div>

      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-[#F4F1E9]/20 flex flex-col md:flex-row justify-between items-center">
        <Typography variant="span" className="!text-[#F4F1E9]/50">
          {t('footer.copyright', { year: currentYear, name: siteConfig.name })}
        </Typography>
      </div>
    </footer>
  );
}
